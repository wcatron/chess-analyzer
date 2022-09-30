declare module "chess-web-api" {
  export type PlayerResult = {
    body: {
      avatar: string;
      player_id: number;
      "@id": string;
      url: string;
      name: string;
      username: string;
      followers: number;
      country: string;
      last_online: number;
      joined: number;
      status: string;
      is_streamer: boolean;
      verified: boolean;
    };
    headers: any;
  };
  export type MonthlyArchiveResults = {
    body: {
      archives: string[];
    };
    headers: any;
  };
  export type GamePlayer = {
    rating: number;
    result:
      | "win"
      | "checkmated"
      | "timeout"
      | "resigned"
      | "stalemate"
      | "agreed"
      | "repetition";
    "@id": string;
    username: string;
    uuid: string;
  };
  export type TimeClasses = "bullet" | "blitz" | "rapid";
  export type Game = {
    url: string;
    pgn: string;
    time_control: string;
    end_time: number;
    rated: true;
    tcn: string;
    uuid: string;
    initial_setup: string;
    fen: string;
    time_class: TimeClasses;
    rules: "chess";
    white: GamePlayer;
    black: GamePlayer;
  };
  export type CompleteMonthlyArchiveResults = {
    body: {
      games: Game[];
    };
    headers: any;
  };
  export default class ChessWebAPI {
    getPlayer(username: string, options?: any): Promise<PlayerResult>;
    getPlayerMonthlyArchives(
      username: string,
      options?: any
    ): Promise<MonthlyArchiveResults>;
    getPlayerCompleteMonthlyArchives(
      username: string,
      year: string | number,
      month: string | number,
      options?: any
    ): Promise<CompleteMonthlyArchiveResults>;
  }
}
