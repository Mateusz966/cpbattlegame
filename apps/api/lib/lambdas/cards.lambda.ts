import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export const createCardsLambda = (scope: Construct, table: dynamodb.Table) => {
  const cardsLambda = new NodejsFunction(scope, "cards", {
    runtime: lambda.Runtime.NODEJS_22_X,
    handler: "handler",
    entry: "functions/cards.ts",
  });

  table.grantReadWriteData(cardsLambda);
  cardsLambda.addEnvironment("CARDS_TABLE_NAME", table.tableName);


  return cardsLambda;

};
