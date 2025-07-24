import { AppSyncResolverEvent } from "aws-lambda";
import { CardService } from "../services/card.service";
import { cardRepository } from "../db/cardRepository";
import {
  CreatePersonCard,
  CreateStarshipCard,
  Card,
  BattleResult,
} from "../types/graphql";

// Argumenty
interface GetCardByIdArguments {
  id: string;
}

interface DeleteCardByIdArguments {
  id: string;
}

interface GetAllByTypeArguments {
  type: string;
}

interface CreatePersonCardArguments {
  card: CreatePersonCard;
}

interface CreateStarshipCardArguments {
  card: CreateStarshipCard;
}

interface UpsertCard {
  id: string;
  card: {
    name: string;
    type: string;
    details: Record<string, any>;
  };
}

type CardResolverEventUnion =
  | (AppSyncResolverEvent<GetCardByIdArguments> & { info: { fieldName: "getCardById" } })
  | (AppSyncResolverEvent<GetAllByTypeArguments> & { info: { fieldName: "getAllByType" } })
  | (AppSyncResolverEvent<CreatePersonCardArguments> & { info: { fieldName: "createPersonCard" } })
  | (AppSyncResolverEvent<CreateStarshipCardArguments> & { info: { fieldName: "createStarshipCard" } })
  | (AppSyncResolverEvent<UpsertCard> & { info: { fieldName: "updateCard" } })
  | (AppSyncResolverEvent<DeleteCardByIdArguments> & { info: { fieldName: "deleteCard" } });


export const handler = async (event: CardResolverEventUnion): Promise<Card | string | BattleResult> => {
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

      case "createPersonCard": {
        const { card } = event.arguments;
        return await service.createCard({ ...card, type: "PersonCard" });
      }

      case "createStarshipCard": {
        const { card } = event.arguments;
        return await service.createCard({ ...card, type: "StarshipCard" });
      }

      case "updateCard": {
        return await service.updateCard(event.arguments.id, event.arguments.card);
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

