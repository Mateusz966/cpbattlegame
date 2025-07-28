import { AppSyncResolverEvent } from "aws-lambda";

import { BattleResult } from "../types";
import { BattleService } from "../services/battle.service";
import { cardRepository } from "../db/cardRepository";

export const handler = async (
  event: AppSyncResolverEvent<{}>
): Promise<BattleResult> => {
  try {
    const battleService = new BattleService(cardRepository);
    const result = await battleService.getBattleResult("PersonCard");

    return result;
  } catch (error) {
    console.error("Error fetching person:", error);
    throw error;
  }
};
