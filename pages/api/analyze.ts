import { Game } from "chess-web-api";
import { Chess, ChessInstance } from "chess.js";
import type { NextApiRequest, NextApiResponse } from "next";

import load_engine from "../../analyzer/load_engine";

function asyncEval(engine, game: ChessInstance): Promise<number | string> {
  return new Promise((resolve, reject) => {
    engine.send("position fen " + game.fen());
    let finalEvaluation: number;
    engine.send(
      "eval",
      () => {
        if (isNaN(finalEvaluation)) {
          console.log("Continue evaluating using other means");
          asyncInfo(engine, game).then((result) => {
            resolve(result);
          });
        } else {
          console.log("Returning evaluation", finalEvaluation);
          resolve(finalEvaluation);
        }
      },
      (data: string) => {
        if (data.startsWith("Final evaluation")) {
          if (data.startsWith("Final evaluation: none (in check)")) {
            console.log("Found a check");
            finalEvaluation = NaN;
          } else {
            // Final evaluation       +0.31 (white side) [with scaled NNUE, hybrid, ...]
            console.log(data);
            finalEvaluation = parseFloat(
              data.split("       ")[1]?.split(" ")[0]
            );
          }
        }
      }
    );
  });
}

function asyncInfo(engine, game: ChessInstance): Promise<number | string> {
  return new Promise((resolve, reject) => {
    engine.send("position fen " + game.fen());
    let finalEvaluation: number | string;
    engine.send(
      "go depth 12",
      () => {
        console.log("done", finalEvaluation);
        if (game.turn() == "b") {
          if (typeof finalEvaluation == "string") {
            resolve("M" + parseInt(finalEvaluation.split("M")[1]) * -1);
          } else {
            resolve(finalEvaluation);
          }
        } else {
          if (typeof finalEvaluation == "string") {
            resolve("M" + parseInt(finalEvaluation.split("M")[1]));
          } else {
            resolve(-finalEvaluation);
          }
        }
      },
      (data: string) => {
        if (data.startsWith("info")) {
          const scoreComponents = data.split("score ")[1]?.split(" ");
          if (scoreComponents && scoreComponents[0] == "mate") {
            finalEvaluation = "M" + scoreComponents[1];
          } else if (scoreComponents && scoreComponents[0] == "cp") {
            finalEvaluation = parseFloat(scoreComponents[1]) / -100;
          }
        }
      }
    );
  });
}

export type AnalysisResults = {
  results: (number | string)[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResults>
) {
  const { pgn, initial_setup } = req.body as Game;

  try {
    let engine = await load_engine("stockfish");
    const startGame = new Chess(initial_setup);
    const fullGame = new Chess();
    fullGame.load_pgn(pgn);
    const results: AnalysisResults["results"] = [];
    console.log(fullGame.history());
    for (const move of fullGame.history()) {
      startGame.move(move);
      const result = await asyncInfo(engine, startGame);
      console.log("Evaluated", move, result);
      results.push(result);
    }
    engine.quit();
    res.status(200).json({ results: results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ results: [] });
  }

  //const analysis = [];
  /*for (const move of fullGame.moves().slice(0, 2)) {
    console.log("Analyzing move", move);
    startGame.move(move);
    const fen = startGame.fen();
    analysis.push(
      chessAnalysisApi.getAnalysis({
        fen,
        depth: 4,
        multipv: 2,
        excludes: [PROVIDERS.LICHESS_BOOK, PROVIDERS.LICHESS_CLOUD_EVAL],
      })
    );
  }
  const results = await Promise.allSettled(analysis);*/
  /*
    results: results.map((move) =>
      move.status == "fulfilled" ? move.value.multipv : undefined
    ),
});*/
}
