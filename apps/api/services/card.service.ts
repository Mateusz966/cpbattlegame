import { v4 as uuidv4 } from "uuid";
import { CardRepository } from "../db/cardRepository";
import { Card, PersonCard, StarshipCard } from "../types/graphql";
import { CreateCardInput, RawCard } from "../types";
import { cardMappers } from "../mappers/cardMappers";

type CardOutput = PersonCard | StarshipCard;

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

  async createCard(input: CreateCardInput): Promise<CardOutput> {
    const now = new Date().toISOString();
    const id = uuidv4();

    const { type, name, ...rest } = input;
    const battleAttributeName = BATTLE_ATTR_MAP[type];
    const battleValue = Number(rest[battleAttributeName] ?? 0);

    const rawCard: RawCard = {
      id,
      type,
      name,
      details: JSON.stringify(rest),
      battleAttributeName,
      battleValue,
      createdAt: now,
      updatedAt: now,
    };

    await this.cardRepository.createCard(rawCard);

    return {
      __typename: type,
      id,
      type,
      name,
      ...rest,
      battleAttributeName,
      battleValue,
      createdAt: now,
      updatedAt: now,
    } as any;
  }

  async getAllByType(type: string): Promise<Card[]> {
    const cards = await this.cardRepository.getAllByType(type);

    return cards.map((card) => cardMappers.fromDatabase(card));
  }

  async updateCard(id: string, input: Partial<CreateCardInput>): Promise<Card> {
    const existing = await this.cardRepository.getCardById(id);
    if (!existing) {
      throw new Error(`Card with id ${id} not found`);
    }

    const updatedCard: RawCard = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await this.cardRepository.createCard(updatedCard);

    return {
      ...updatedCard,
      __typename: updatedCard.type,
    };
  }

  async deleteCardById(id: string): Promise<string> {
    // TODO: dummy
    return `Card with id ${id} deleted (not really)`;
  }
}
