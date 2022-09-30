import { TimeClasses } from "chess-web-api";
import useSWR from "swr";
import { GameData } from "../pages/api/games";
import { fetcher } from "../utils/fetcher";
import { VisualizeGame } from "./VisualizeGame";

function useGames({
  username,
  time_class,
  limit = 5,
}: {
  username: string;
  time_class: TimeClasses;
  limit?: number;
}) {
  const { data, error } = useSWR<GameData>(
    `/api/games?username=${username}&time_class=${time_class}&limit=${limit}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
}

export const VisualizeRoot = ({
  username,
  time_class,
}: {
  username: string;
  time_class: TimeClasses;
}) => {
  const { isLoading, isError, results } = useGames({ username, time_class });
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError || !results) {
    return <div>Error loading game data!</div>;
  }
  return (
    <div>
      {results.map((game) => (
        <VisualizeGame key={game.uuid} game={game} />
      ))}
    </div>
  );
};
