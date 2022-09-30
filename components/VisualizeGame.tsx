import { Game, GamePlayer } from "chess-web-api";
import { useCurrentUsername } from "./CurrentUsername";
import { format } from "date-fns";
import { isDraw } from "../analyzer/analyzer";
import { AnalyzeGame } from "./AnalyzeGame";

export const VisualizeGame = ({ game }: { game: Game }) => {
  const currentUsername = useCurrentUsername();
  const {
    me,
    opponent,
    myColor,
  }: {
    me: GamePlayer;
    opponent: GamePlayer;
    myColor: "white" | "black";
  } =
    game.white.username == currentUsername
      ? {
          me: game.white,
          opponent: game.black,
          myColor: "white",
        }
      : {
          me: game.black,
          opponent: game.white,
          myColor: "black",
        };

  const ratingDiff = opponent.rating - me.rating;
  const date = new Date(game.end_time * 1000);
  const resultColor =
    me.result == "win" ? "darkgreen" : isDraw(me.result) ? "grey" : "darkred";
  return (
    <div
      style={{
        margin: "0.2em 0em",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            margin: 4,
            padding: 0,
            height: 40,
          }}
        >
          <AnalyzeGame game={game} myColor={myColor} />
        </div>
        <a href={game.url} target="blank">
          <div
            style={{
              border: myColor,
              borderWidth: myColor == "white" ? 1 : 2,
              borderStyle: "solid",
              width: 220,
              height: 44,
              margin: 2,
              padding: 10,
              borderRadius: 2,
              backgroundColor:
                myColor == "white"
                  ? "rgba(254,254,254, 0.5)"
                  : "rgba(0,0,0,0.5)",
            }}
          >
            <span
              style={{
                color: resultColor,
                fontWeight: "bold",
                fontStyle: "italic",
              }}
            >
              {me.result}
            </span>
            <span
              style={{
                float: "right",
              }}
            >
              {me.rating} ({ratingDiff})
            </span>
          </div>
        </a>
      </div>
      <div>
        <span
          style={{
            fontSize: 10,
            verticalAlign: "top",
            color: "grey",
          }}
        >
          {format(date, "d MMM, yy")} - {opponent.username}
        </span>
      </div>
    </div>
  );
};
