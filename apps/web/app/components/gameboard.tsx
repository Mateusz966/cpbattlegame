"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Button,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useGetBattleResultQuery } from "../../gql/generated";

export const GameBoard = () => {
  const { data, loading, refetch } = useGetBattleResultQuery({
    variables: { type: "PersonCard" },
  });

  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const cards = data?.getBattleResult.cards;
  const winnerId = data?.getBattleResult.winnerId;

  useEffect(() => {
    if (cards && winnerId) {
      if (cards[0]?.id === winnerId) {
        setLeftScore((prev) => prev + 1);
      } else {
        setRightScore((prev) => prev + 1);
      }
    }
  }, [cards, winnerId]);

  if (loading || !cards) return <p>Loading...</p>;

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Bitwa!
      </Typography>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <Typography variant="h5">Player 1 score: {leftScore}</Typography>
        </Grid>
        <Grid>
          <Typography variant="h5">Player 2 score: {rightScore}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={4}>
        {cards.map((card) => {
          const isWinner = card.id === winnerId;
          return (
            <Grid size={12} md={6} key={card.id}>
              <Card
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
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Button variant="contained" sx={{ mt: 4 }} onClick={() => refetch()}>
        Play again
      </Button>
    </div>
  );
};
