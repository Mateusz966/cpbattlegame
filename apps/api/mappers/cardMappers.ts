import { RawCard } from "../types";
import { Card } from "../types/graphql";

const safeParseJSON = (json: string, id: string): Record<string, any> => {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`Invalid JSON in card ${id}, details: ${json}`);
  }
};

export const cardMappers = {
  fromDatabase: (db: RawCard): Card => {
    const parsedDetails = safeParseJSON(db.details, db.id);

    console.log("cardMappers.fromDatabase", db, parsedDetails);

    return {
      id: db.id,
      name: db.name,
      __typename: db.type,
      battleAttributeName: db.battleAttributeName,
      battleValue: db.battleValue,
      createdAt: db.createdAt,
      updatedAt: db.updatedAt,
      ...parsedDetails,
    } as Card;
  },

  toDatabase: (card: Card): RawCard => {
    const { id, name, ...details } = card;

    return {
      id,
      name,
      type: card.__typename,
      details: JSON.stringify(details),
      battleAttributeName: card.battleAttributeName,
      battleValue: card.battleValue,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  },
};
