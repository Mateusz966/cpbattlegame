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
    if (cards[0].attributeValue > cards[1].attributeValue) {
      return cards[0].PK;
    } else {
      return cards[1].PK;
    }
  }
  async getBattleResult(type) {
    const cards = await this.cardRepository.getAllByType(type);
    const shuffledCards = cards.sort(() => 0.5 - Math.random()).splice(0, 2);
    console.log("cards", shuffledCards);
    const winnerId = await this._calculateWinner(shuffledCards);
    console.log("winnerId", winnerId);
    return {
      cards: [shuffledCards[0], shuffledCards[1]],
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
  async createCard(card) {
    await client.send(
      new import_client_dynamodb.PutItemCommand({
        TableName: tableName,
        Item: (0, import_util_dynamodb.marshall)(card)
      })
    );
  }
  async getCardById(id) {
    const { Item } = await client.send(
      new import_client_dynamodb.GetItemCommand({
        TableName: tableName,
        Key: {
          PK: { S: id }
        }
      })
    );
    return Item ? (0, import_util_dynamodb.unmarshall)(Item) : void 0;
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
