import { gql } from "@apollo/client";

export const GET_BATTLE_RESULT = gql`
  query GetBattleResult($type: String!) {
    getBattleResult(type: $type) {
      winnerId
      cards {
        __typename
        ... on PersonCard {
          id
          name
          mass
          hair_color
          height
          gender
        }
        ... on StarshipCard {
          id
          name
          crew
        }
      }
    }
  }
`;
