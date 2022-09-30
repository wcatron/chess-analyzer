import ChessWebAPI, { Game, GamePlayer, TimeClasses } from "chess-web-api";

var chessAPI = new ChessWebAPI();

function nextMonthYear(
  month: number,
  year: number
): { nextMonth: number; nextYear: number } {
  if (month == 1) {
    return { nextMonth: 12, nextYear: year - 1 };
  }
  return { nextMonth: month - 1, nextYear: year };
}

export const drawResults: GamePlayer["result"][] = [
  "stalemate",
  "agreed",
  "repetition",
];
export function isDraw(result: GamePlayer["result"]) {
  return drawResults.includes(result);
}

export const validTimeClasses: TimeClasses[] = ["bullet", "blitz", "rapid"];
export function isValidTimeClass(a: any): a is TimeClasses {
  return a && validTimeClasses.includes(a);
}

export async function getLatestGames(
  filters: {
    username: string;
    limit?: number;
    time_class?: Game["time_class"][];
    result?: GamePlayer["result"][];
  },
  offsetMonth?: number,
  offsetYear?: number,
  prev: Game[] = []
): Promise<Game[]> {
  if (offsetMonth === undefined || offsetYear === undefined) {
    const today = new Date();
    offsetMonth = today.getMonth() + 1;
    offsetYear = today.getFullYear();
  }
  console.log("Getting latest games ", offsetMonth, offsetYear, prev.length);
  const { username, limit = 100, result, time_class } = filters;
  const all = await chessAPI.getPlayerCompleteMonthlyArchives(
    username,
    offsetYear,
    offsetMonth
  );
  const filtered = all.body.games.filter((game) => {
    if (time_class && !time_class.includes(game.time_class)) {
      return false;
    }
    const me = game.white.username == username ? game.white : game.black;
    if (result && !result.includes(me.result)) {
      return false;
    }
    return true;
  });
  console.log("Retrieved games #", all.body.games.length);
  console.log("Filtered games #", filtered.length);
  if (limit < filtered.length + prev.length) {
    console.log("Reached limit ", limit, filtered.length, prev.length);
    const count = limit - prev.length;
    return filtered.slice(filtered.length - count).concat(prev);
  } else {
    const { nextMonth, nextYear } = nextMonthYear(offsetMonth, offsetYear);
    return getLatestGames(filters, nextMonth, nextYear, filtered.concat(prev));
  }
}
