import { Card, UpsertPersonCard, UpsertStarshipCard } from "./graphql";

export interface BattleResult {
  cards: Card[]
  winnerId: string;
}

export type CardType = "PersonCard" | "StarshipCard";

export interface RawCard {
  id: string;
  type: CardType;
  name: string;
  details: string;
  battleAttributeName: string;
  battleValue: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type UpsertCardInput =
  | (UpsertPersonCard & { type: "PersonCard" })
  | (UpsertStarshipCard & { type: "StarshipCard" });
