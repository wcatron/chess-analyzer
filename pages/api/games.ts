// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Game } from "chess-web-api";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getLatestGames,
  isValidTimeClass,
  validTimeClasses,
} from "../../analyzer/analyzer";

export type GameData = {
  results: Game[];
  count: number;
};

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameData | Error>
) {
  const username = req.query.username;
  const time_class = req.query.time_class;
  const limit = req.query.limit;
  if (typeof username !== "string") {
    return res.status(400).json({ message: "Missing valid username" });
  }
  if (time_class && !isValidTimeClass(time_class)) {
    return res.status(400).json({ message: "Invalid value for time_class" });
  }
  if (typeof limit !== "string") {
    return res.status(400).json({ message: "Invalid value for limit" });
  }
  const games = await getLatestGames({
    username,
    limit: parseInt(limit),
    time_class: isValidTimeClass(time_class) ? [time_class] : undefined,
  });
  res.status(200).json({ results: games.reverse(), count: games.length });
}
