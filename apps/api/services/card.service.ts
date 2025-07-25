import { v4 as uuidv4 } from "uuid";
import { CardRepository } from "../db/cardRepository";
import { Card, PersonCard, StarshipCard } from "../types/graphql";
import { UpsertCardInput, RawCard } from "../types";
import { cardMappers } from "../mappers/cardMappers";

const BATTLE_ATTR_MAP = {
  PersonCard: "mass",
  StarshipCard: "crew",
} as const;

export class CardService {
  private cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository;
  }

  async getCardById(id: string): Promise<Card> {
    const item = await this.cardRepository.getCardById(id);

    if (!item) {
      throw new Error(`Card with id ${id} not found`);
    }

    return cardMappers.fromDatabase(item);
  }

  async upsertCard(input: UpsertCardInput): Promise<Card> {
    const now = new Date().toISOString();

    const { type, name, id, ...details } = input;
    const battleAttributeName = BATTLE_ATTR_MAP[type];
    const battleValue = Number(rest[battleAttributeName] ?? 0);

    const rawCard: RawCard = {
      id: id ?? uuidv4(),
      type,
      name,
      details: JSON.stringify(details),
      battleAttributeName,
      battleValue,
      createdAt: now,
      updatedAt: now,
    };

    await this.cardRepository.upsertCard(rawCard);

    return {
      id,
      name,
      ...details,
      battleAttributeName,
      battleValue,
      createdAt: now,
      updatedAt: now,
      __typename: type,
    } as Card;
  }

  async getAllByType(type: string): Promise<Card[]> {
    const cards = await this.cardRepository.getAllByType(type);

    return cards.map((card) => cardMappers.fromDatabase(card));
  }

  async deleteCardById(id: string): Promise<string> {
    // TODO: dummy
    return `Card with id ${id} deleted (not really)`;
  }
}
