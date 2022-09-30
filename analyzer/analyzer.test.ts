import { drawResults, getLatestGames } from "./analyzer";
const username = "wesman95";

getLatestGames({
  username,
  limit: 20,
  time_class: ["blitz"],
}).then((games) => {
  const wins = games.filter((game) => {
    const me = game.white.username == username ? game.white : game.black;
    return me.result == "win";
  });
  const losses = games.filter((game) => {
    const other = game.white.username != username ? game.white : game.black;
    return other.result == "win";
  });
  const draws = games.filter((game) => {
    const me = game.white.username == username ? game.white : game.black;
    return drawResults.includes(me.result);
  });
  const other = games.filter((game) => {
    const me = game.white.username == username ? game.white : game.black;
    const other = game.white.username != username ? game.white : game.black;
    return !(
      me.result == "win" ||
      drawResults.includes(me.result) ||
      other.result == "win"
    );
  });
  console.log(other);
  console.log("Wins", wins.length);
  console.log("Losses", losses.length);
  console.log("Draws", draws.length);
  console.log("Total Games", games.length);
});
