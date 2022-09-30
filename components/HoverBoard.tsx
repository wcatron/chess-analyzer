import { Game } from "chess-web-api";
import { Chess, ChessInstance } from "chess.js";
import React, { createContext, useContext, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useCurrentUsername } from "./CurrentUsername";

export const HoverBoardGame = createContext<
  [undefined | Game, undefined | number, boolean]
>([undefined, undefined, false]);
export const HoverBoardGameSet = createContext<
  [(game: Game) => void, (move: number) => void, (selected: boolean) => void]
>([() => {}, () => {}, () => {}]);

export const WithHoverBoard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [game, setGame] = useState<undefined | Game>();
  const [move, setMove] = useState<undefined | number>();
  const [selected, setSelected] = useState<boolean>(false);
  return (
    <HoverBoardGame.Provider value={[game, move, selected]}>
      <HoverBoardGameSet.Provider value={[setGame, setMove, setSelected]}>
        {children}
      </HoverBoardGameSet.Provider>
    </HoverBoardGame.Provider>
  );
};

export const useHoverBoard = () => {
  const [game, moveNumber, selected] = useContext(HoverBoardGame);
  const [setGame, setMove, setSelected] = useContext(HoverBoardGameSet);

  return {
    game,
    setGame,
    move: moveNumber,
    setMove,
    selected,
    setSelected,
  };
};

export const useSetHoverBoard = () => {
  const [setGame, setMove] = useContext(HoverBoardGameSet);
  return { setGame, setMove };
};

export const HoverBoard = () => {
  const { game, move: moveNumber, setMove } = useHoverBoard();
  const currentChess = useMemo(() => {
    const chess = new Chess();
    if (game) {
      const chessGame = new Chess();
      chessGame.load_pgn(game.pgn);
      for (const move of chessGame.history().splice(0, moveNumber)) {
        chess.move(move);
      }
    }
    return chess;
  }, [game?.uuid, moveNumber]);
  const currentUsername = useCurrentUsername();
  const myColor =
    game && game.black.username == currentUsername ? "black" : "white";
  return (
    <div>
      <Chessboard
        id="BasicBoard"
        position={currentChess.fen()}
        boardOrientation={myColor}
      />
      {moveNumber && (
        <>
          <button
            onClick={() => {
              setMove(moveNumber - 1);
            }}
          >
            Prev
          </button>
          <button
            onClick={() => {
              setMove(moveNumber + 1);
            }}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};
