import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Card } from "../types/graphql";
import { RawCard } from "../types";

const client = new DynamoDBClient({});
const tableName = process.env.CARDS_TABLE_NAME!;

export class CardRepository {
  constructor() {
    console.log("CardRepository initialized");
  }

  async getAllByType(type: string): Promise<RawCard[]> {
    const { Items } = await client.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: "#t = :type",
        ExpressionAttributeNames: { "#t": "type" },
        ExpressionAttributeValues: { ":type": { S: type } },
      })
    );

    return Items?.map((item) => unmarshall(item) as RawCard) || [];
  }

  async createCard(card: RawCard): Promise<void> {
    await client.send(
      new PutItemCommand({
        TableName: tableName,
        Item: marshall(card),
      })
    );
  }

  async getCardById(id: string): Promise<RawCard | undefined> {
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: tableName,
        Key: {
          id: { S: id },
        },
      })
    );

    return Item ? (unmarshall(Item) as Card) : undefined;
  }
}

export const cardRepository = new CardRepository();
