"use client";

import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetBattleResultQuery } from "../../gql/generated";
import { BattleCard } from "./battle-card";

type CardType = "PersonCard" | "StarshipCard";

export const GameBoard = () => {
  const [type, setType] = useState<CardType | "">("");
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const { data, loading, refetch } = useGetBattleResultQuery({
    variables: { type },
    skip: !type,
  });

  const cards = data?.getBattleResult.cards;
  const winnerId = data?.getBattleResult.winnerId;

  useEffect(() => {
    if (cards && winnerId) {
      if (cards[0]?.id === winnerId) setLeftScore((prev) => prev + 1);
      else setRightScore((prev) => prev + 1);
    }
  }, [cards, winnerId]);

  const handlePlayAgain = () => {
    if (type) refetch();
  };

  const resetCounters = () => {
    setLeftScore(0);
    setRightScore(0);
  };

  return (
    <Box
    >
      <Typography variant="h3" gutterBottom>
        Card Fight!
      </Typography>

      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Player 1 score: {leftScore}</Typography>
        <Typography variant="h5">Player 2 score: {rightScore}</Typography>
      </Grid>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="type-select-label">Wybierz typ karty</InputLabel>
        <Select
          labelId="type-select-label"
          value={type}
          label="Select card type"
          onChange={(e) => {
            setType(e.target.value);
            resetCounters();
          }}
        >
          <MenuItem value="PersonCard">PersonCard</MenuItem>
          <MenuItem value="StarshipCard">StarshipCard</MenuItem>
        </Select>
      </FormControl>

      {loading && type && <Typography>Loading...</Typography>}

      {cards && (
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid key={card.id}>
              <BattleCard card={card} isWinner={card.id === winnerId} />
            </Grid>
          ))}
        </Grid>
      )}

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        disabled={!type}
        onClick={handlePlayAgain}
      >
        PLAY AGAIN
      </Button>
    </Box>
  );
};
