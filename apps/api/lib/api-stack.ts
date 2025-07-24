import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { createCardBattleLambda } from "./lambdas/card-battle.lambda";
import { createCardsLambda } from "./lambdas/cards.lambda";

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "cpbattlegame-api", {
      name: "cpbattlegame-api",
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
      definition: appsync.Definition.fromSchema(
        appsync.SchemaFile.fromAsset("schema.graphql")
      ),
    });

    const cardsTable = new dynamodb.Table(this, "Cards", {
      tableName: "cards",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    cardsTable.addGlobalSecondaryIndex({
      indexName: "TypeIndex",
      partitionKey: { name: "type", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const cardBattleLambda = createCardBattleLambda(this, cardsTable);
    const cardsLambda = createCardsLambda(this, cardsTable);

    const getBattleResultDs = api.addLambdaDataSource(
      "GetBattleResultDs",
      cardBattleLambda
    );

    const cardLambdaDs = api.addLambdaDataSource("CardLambdaDs", cardsLambda);

    // Resolvers
    cardLambdaDs.createResolver("getCardByIdResolver", {
      typeName: "Query",
      fieldName: "getCardById",
    });

    cardLambdaDs.createResolver("getAllByTypeResolver", {
      typeName: "Query",
      fieldName: "getAllByType",
    });

    cardLambdaDs.createResolver("createPersonCardResolver", {
      typeName: "Mutation",
      fieldName: "createPersonCard",
    });

    cardLambdaDs.createResolver("createStarshipCardResolver", {
      typeName: "Mutation",
      fieldName: "createStarshipCard",
    });

    getBattleResultDs.createResolver("getBattleResultResolver", {
      typeName: "Query",
      fieldName: "getBattleResult",
    });

    // Outputs
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });
  }
}
