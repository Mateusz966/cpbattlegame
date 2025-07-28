import { cardMappers } from "../../mappers/card.mapper";
import { RawCard } from "../../types";
import { Card } from "../../types/graphql";
import { describe, it, expect } from "@jest/globals";

describe("cardMappers", () => {
  const baseRawCard: RawCard = {
    id: "123",
    name: "Luke Skywalker",
    type: "PersonCard",
    details: JSON.stringify({
      mass: 77,
      height: 172,
      hair_color: "blond",
      gender: "male",
    }),
    battleAttributeName: "mass",
    battleValue: 77,
    createdAt: "2025-07-24T21:58:20.800Z",
    updatedAt: "2025-07-24T21:58:20.800Z",
  };

  it("should map from RawCard to Card correctly", () => {
    const card = cardMappers.fromDatabase(baseRawCard);

    expect(card).toEqual({
      id: "123",
      name: "Luke Skywalker",
      __typename: "PersonCard",
      mass: 77,
      height: 172,
      hair_color: "blond",
      gender: "male",
      battleAttributeName: "mass",
      battleValue: 77,
      createdAt: "2025-07-24T21:58:20.800Z",
      updatedAt: "2025-07-24T21:58:20.800Z",
    });
  });

  it("should map from Card to RawCard correctly", () => {
    const card: Card = {
      id: "123",
      name: "Luke Skywalker",
      __typename: "PersonCard",
      mass: 77,
      height: 172,
      hair_color: "blond",
      gender: "male",
      battleAttributeName: "mass",
      battleValue: 77,
      createdAt: "2025-07-24T21:58:20.800Z",
      updatedAt: "2025-07-24T21:58:20.800Z",
    };

    const raw = cardMappers.toDatabase(card);

    expect(raw).toEqual(baseRawCard);
  });

  it("should throw on invalid JSON in details", () => {
    const brokenRawCard: RawCard = {
      ...baseRawCard,
      details: "INVALID_JSON",
    };

    expect(() => cardMappers.fromDatabase(brokenRawCard)).toThrowError(
      /Invalid JSON/
    );
  });
});
