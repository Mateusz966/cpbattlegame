import { AppSyncResolverEvent } from "aws-lambda";
import { CardService } from "../services/card.service";
import { cardRepository } from "../db/card.repository";
import {
  UpsertPersonCard,
  UpsertStarshipCard,
  Card,
  BattleResult,
} from "../types/graphql";

interface GetCardByIdArguments {
  id: string;
}

interface DeleteCardByIdArguments {
  id: string;
}

interface GetAllByTypeArguments {
  type: string;
}

interface UpsertPersonCardArguments {
  card: UpsertPersonCard;
}

interface UpsertStarshipCardArguments {
  card: UpsertStarshipCard;
}

type CardResolverEventUnion =
  | (AppSyncResolverEvent<GetCardByIdArguments> & {
      info: { fieldName: "getCardById" };
    })
  | (AppSyncResolverEvent<GetAllByTypeArguments> & {
      info: { fieldName: "getAllByType" };
    })
  | (AppSyncResolverEvent<UpsertPersonCardArguments> & {
      info: { fieldName: "upsertPersonCard" };
    })
  | (AppSyncResolverEvent<UpsertStarshipCardArguments> & {
      info: { fieldName: "upsertStarshipCard" };
    })
  | (AppSyncResolverEvent<DeleteCardByIdArguments> & {
      info: { fieldName: "deleteCard" };
    });

export const handler = async (
  event: CardResolverEventUnion
): Promise<Card | string | BattleResult> => {
  try {
    const service = new CardService(cardRepository);

    switch (event.info.fieldName) {
      case "getCardById": {
        const card = await service.getCardById(event.arguments.id);
        console.log("card", card);
        return card;
      }

      case "getAllByType": {
        return await service.getAllByType(event.arguments.type);
      }

      case "upsertPersonCard": {
        const { card } = event.arguments;
        return await service.upsertCard({ ...card, type: "PersonCard" });
      }

      case "upsertStarshipCard": {
        const { card } = event.arguments;
        return await service.upsertCard({ ...card, type: "StarshipCard" });
      }

      case "deleteCard": {
        return await service.deleteCardById(event.arguments.id);
      }
    }

    throw new Error(`Unsupported field: ${event.info.fieldName}`);
  } catch (error) {
    console.error("Error handling resolver:", error);
    throw error;
  }
};
