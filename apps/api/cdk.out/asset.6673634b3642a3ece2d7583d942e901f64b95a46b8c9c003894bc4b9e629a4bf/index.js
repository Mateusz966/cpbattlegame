"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/apps/api/functions/getBattleResult.ts
var getBattleResult_exports = {};
__export(getBattleResult_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(getBattleResult_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_util_dynamodb = require("@aws-sdk/util-dynamodb");
var client = new import_client_dynamodb.DynamoDBClient({ region: process.env.AWS_REGION });
var tableName = process.env.CARDS_TABLE_NAME;
var handler = async (event) => {
  console.log("Getting random person from DynamoDB table", tableName);
  try {
    const command = new import_client_dynamodb.ScanCommand({
      TableName: tableName
    });
    const response = await client.send(command);
    if (!response.Items || response.Items.length === 0) {
      throw new Error("No items found in the table");
    }
    const randomPerson = (0, import_util_dynamodb.unmarshall)(response.Items[0]);
    return randomPerson;
  } catch (error) {
    console.error("Error fetching person:", error);
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
