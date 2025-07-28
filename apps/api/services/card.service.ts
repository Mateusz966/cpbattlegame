import { v4 as uuidv4 } from "uuid";
import { CardRepository } from "../db/card.repository";
import { Card } from "../types/graphql";
import { UpsertCardInput, RawCard } from "../types";
import { cardMappers } from "../mappers/card.mapper";

const BATTLE_ATTR_MAP = {
  PersonCard: "mass",
  StarshipCard: "crew",
} as const;

export class CardService {
  private cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository;
  }

  private _setBattleValue(card: UpsertCardInput): number {
    let battleValue = 0;

    if (card.type === "PersonCard") {
      battleValue = card.mass;
    } else if (card.type === "StarshipCard") {
      battleValue = card.crew;
    }

    return battleValue;
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
    const battleValue = this._setBattleValue(input);
    const cardId = id ?? uuidv4();

    const rawCard: RawCard = {
      id: cardId,
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
      id: cardId,
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
    await this.cardRepository.deleteCardById(id);
    return `Card with id: ${id} deleted`;
  }
}
