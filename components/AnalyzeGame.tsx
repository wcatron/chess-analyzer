import { Game } from "chess-web-api";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { AnalysisResults } from "../pages/api/analyze";
import { fetcher } from "../utils/fetcher";
import { useHoverBoard, useSetHoverBoard } from "./HoverBoard";
import { Chart } from "./root";

function useAnalysis(game: Game) {
  const { data, error } = useSWR<AnalysisResults>(
    [
      `/api/analyze`,
      {
        method: "POST",
        body: JSON.stringify(game),
        headers: {
          "Content-Type": "application/json",
        },
      },
    ],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error) {
    console.error(error);
  }
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
}

export const AnalyzeGame = ({
  game,
  myColor,
}: {
  game: Game;
  myColor: "black" | "white";
}) => {
  const { isLoading, isError, results } = useAnalysis(game);
  const {
    game: currentHoverBoard,
    move,
    selected,
    setGame,
    setMove,
    setSelected,
  } = useHoverBoard();

  const onHoverMove = useMemo(() => {
    if (selected) {
      return;
    }
    return currentHoverBoard?.uuid !== game.uuid
      ? () => setGame(game)
      : setMove;
  }, [selected, currentHoverBoard?.uuid, game.uuid]);

  const onSelectMove = useMemo(() => {
    return selected
      ? () => setSelected(false)
      : (move: number) => {
          setGame(game);
          setSelected(true);
          setMove(move);
        };
  }, [selected, setSelected, move, game.uuid]);

  if (results || isLoading) {
    return (
      <Chart
        data={results}
        myColor={myColor}
        loading={isLoading}
        selectedMove={currentHoverBoard?.uuid === game.uuid ? move : undefined}
        onHoverMove={onHoverMove}
        onSelectMove={onSelectMove}
      />
    );
  }

  if (isError) {
    return <p>Error</p>;
  }

  return <div>Fall through {isLoading}</div>;
};
