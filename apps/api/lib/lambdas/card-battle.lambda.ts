import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export const createCardBattleLambda = (
  scope: Construct,
  table: dynamodb.Table
) => {
  const cardBattleLambda = new NodejsFunction(scope, "card-battle", {
    runtime: lambda.Runtime.NODEJS_22_X,
    handler: "handler",
    entry: "functions/card-battle.ts",
  });

  table.grantReadData(cardBattleLambda);
  cardBattleLambda.addEnvironment("CARDS_TABLE_NAME", table.tableName);

  return cardBattleLambda;
};
