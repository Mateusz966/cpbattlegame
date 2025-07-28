import { AppSyncResolverEvent } from "aws-lambda";

import { BattleResult, CardType } from "../types";
import { BattleService } from "../services/battle.service";
import { cardRepository } from "../db/card.repository";

export const handler = async (
  event: AppSyncResolverEvent<{
    type: CardType;
  }>
): Promise<BattleResult> => {
  try {
    const battleService = new BattleService(cardRepository);
    const result = await battleService.getBattleResult(event.arguments.type);

    return result;
  } catch (error) {
    console.error("Error fetching person:", error);
    throw error;
  }
};
