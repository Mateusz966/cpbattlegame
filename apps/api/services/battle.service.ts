import { CardRepository } from "../db/card.repository";
import { cardMappers } from "../mappers/card.mapper";
import { BattleResult, Card } from "../types/graphql";

export class BattleService {
  constructor(private cardRepository: CardRepository) {}

  private _calculateWinner(cards: Card[]): string {
    if (cards[0].battleValue > cards[1].battleValue) {
      return cards[0].id;
    } else {
      return cards[1].id;
    }
  }

  async getBattleResult(type: string): Promise<BattleResult> {
    const allCards = (await this.cardRepository.getAllByType(type)).map(
      (card) => cardMappers.fromDatabase(card)
    );
    const shuffledCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 2);

    if (shuffledCards.length < 2) {
      throw new Error("Not enough cards to run a battle.");
    }

    const winnerId = this._calculateWinner(shuffledCards);

    return {
      cards: shuffledCards,
      winnerId,
      __typename: "BattleResult",
    };
  }
}
