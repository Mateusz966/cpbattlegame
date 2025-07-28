import { CardService } from "../../services/card.service";
import { CardRepository } from "../../db/card.repository";
import { RawCard } from "../../types";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

jest.mock("uuid", () => ({ v4: () => "mocked-uuid" }));

const mockRepository: jest.Mocked<CardRepository> = {
  getCardById: jest.fn(),
  getAllByType: jest.fn(),
  upsertCard: jest.fn(),
  deleteCardById: jest.fn()
};

describe("CardService", () => {
  let service: CardService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CardService(mockRepository);
  });

  describe("getCardById", () => {
    it("should return mapped card if found", async () => {
      const rawCard: RawCard = {
        id: "1",
        name: "Luke",
        type: "PersonCard",
        details: JSON.stringify({
          mass: 77,
          height: 172,
          hair_color: "blond",
          gender: "male",
        }),
        battleAttributeName: "mass",
        battleValue: 77,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };

      mockRepository.getCardById.mockResolvedValue(rawCard);

      const result = await service.getCardById("1");
      expect(result).toMatchObject({ id: "1", name: "Luke", mass: 77 });
    });

    it("should throw if card not found", async () => {
      mockRepository.getCardById.mockResolvedValue(undefined);
      await expect(service.getCardById("not-found")).rejects.toThrow(
        "Card with id not-found not found"
      );
    });
  });

  describe("upsertCard", () => {
    it("should upsert person card and return mapped card", async () => {
      const input = {
        type: "PersonCard",
        name: "Yoda",
        mass: 17,
        height: 66,
        hair_color: "white",
        gender: "male",
      };

      const result = await service.upsertCard(input as any);

      expect(mockRepository.upsertCard).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "mocked-uuid",
          name: "Yoda",
          type: "PersonCard",
          battleAttributeName: "mass",
          battleValue: 17,
        })
      );

      expect(result).toMatchObject({
        name: "Yoda",
        __typename: "PersonCard",
        battleValue: 17,
      });
    });
  });

  describe("getAllByType", () => {
    it("should return mapped cards", async () => {
      const rawCards: RawCard[] = [
        {
          id: "1",
          name: "Leia",
          type: "PersonCard",
          details: JSON.stringify({
            mass: 49,
            height: 150,
            hair_color: "brown",
            gender: "female",
          }),
          battleAttributeName: "mass",
          battleValue: 49,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ];

      mockRepository.getAllByType.mockResolvedValue(rawCards);

      const result = await service.getAllByType("PersonCard");
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ name: "Leia", mass: 49 });
    });
  });

  describe("deleteCardById", () => {
    it("should return dummy delete message", async () => {
      const result = await service.deleteCardById("abc-123");
      expect(result).toBe("Card with id: abc-123 deleted");
    });
  });
});
