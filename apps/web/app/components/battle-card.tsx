import {
  Card as MUICard,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { GetBattleResultQuery } from "../../gql/generated";

type UICard = GetBattleResultQuery["getBattleResult"]["cards"][number];

type Props = {
  card: UICard;
  isWinner: boolean;
};

export const BattleCard = ({ card, isWinner }: Props) => {
  return (
    <MUICard
      sx={{
        backgroundColor: isWinner ? "#fff8dc" : "#f5f5f5",
        border: isWinner ? "3px solid gold" : "1px solid #ccc",
      }}
    >
      <CardHeader title={card.name} />
      <CardContent>
        {"mass" in card && (
          <>
            <Typography>mass: {card.mass}</Typography>
            <Typography>height: {card.height}</Typography>
            <Typography>gender: {card.gender}</Typography>
            <Typography>hair color: {card.hair_color}</Typography>
          </>
        )}
        {"crew" in card && (
          <>
            <Typography>crew: {card.crew}</Typography>
          </>
        )}
      </CardContent>
    </MUICard>
  );
};
