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

// asset-input/apps/api/services/battle.service.ts
var BattleService = class {
  cardRepository;
  constructor(cardRepository2) {
    this.cardRepository = cardRepository2;
  }
  async _calculateWinner(cards) {
    const shuffledCards = cards.sort(() => 0.5 - Math.random()).splice(0, 2);
    if (shuffledCards[0].attributeValue > shuffledCards[1].attributeValue) {
      return shuffledCards[0].id;
    } else {
      return shuffledCards[1].id;
    }
  }
  async getBattleResult(type) {
    const cards = await this.cardRepository.getAllByType(type);
    const winnerId = await this._calculateWinner(cards);
    return {
      cards: [cards[0], cards[1]],
      winnerId
    };
  }
};

// asset-input/apps/api/db/cardRepository.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_util_dynamodb = require("@aws-sdk/util-dynamodb");
var client = new import_client_dynamodb.DynamoDBClient({});
var tableName = process.env.CARDS_TABLE_NAME;
var CardRepository = class {
  constructor() {
    console.log("CardRepository initialized");
  }
  async getAllByType(type) {
    const { Items } = await client.send(
      new import_client_dynamodb.ScanCommand({
        TableName: tableName,
        FilterExpression: `#t = :type`,
        ExpressionAttributeNames: { "#t": "type" },
        ExpressionAttributeValues: { ":type": { S: type } }
      })
    );
    return Items?.map((item) => (0, import_util_dynamodb.unmarshall)(item)) || [];
  }
};
var cardRepository = new CardRepository();

// asset-input/apps/api/functions/getBattleResult.ts
var handler = async (event) => {
  try {
    const battleService = new BattleService(cardRepository);
    const result = await battleService.getBattleResult("person");
    return result;
  } catch (error) {
    console.error("Error fetching person:", error);
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
