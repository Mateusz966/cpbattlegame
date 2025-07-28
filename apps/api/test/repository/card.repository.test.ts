import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { describe, it, expect, beforeEach } from "@jest/globals";
import { CardRepository } from "../../db/card.repository";
import { RawCard } from "../../types";

const ddbMock = mockClient(DynamoDBClient);

describe("CardRepository", () => {
  let repository: CardRepository;

  beforeEach(() => {
    repository = new CardRepository();
    ddbMock.reset();
  });

  it("should return cards filtered by type", async () => {
    const mockItems = [
      {
        id: { S: "1" },
        name: { S: "Luke Skywalker" },
        type: { S: "PersonCard" },
        details: { S: JSON.stringify({ mass: 77 }) },
        battleAttributeName: { S: "mass" },
        battleValue: { N: "77" },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
      },
    ];

    ddbMock.on(ScanCommand).resolves({ Items: mockItems });

    const result = await repository.getAllByType("PersonCard");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("should return a single card by id", async () => {
    const mockItem = {
      id: { S: "123" },
      name: { S: "X-Wing" },
      type: { S: "StarshipCard" },
      details: { S: JSON.stringify({ crew: 1 }) },
      battleAttributeName: { S: "crew" },
      battleValue: { N: "1" },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() },
    };

    ddbMock.on(GetItemCommand).resolves({ Item: mockItem });

    const result = await repository.getCardById("123");

    expect(result?.id).toBe("123");
    expect(result?.type).toBe("StarshipCard");
  });

  it("should upsert a card", async () => {
    const card: RawCard = {
      id: "42",
      name: "Yoda",
      type: "PersonCard",
      details: JSON.stringify({ mass: 17 }),
      battleAttributeName: "mass",
      battleValue: 17,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ddbMock.on(PutItemCommand).resolves({});

    await repository.upsertCard(card);
  });
});


