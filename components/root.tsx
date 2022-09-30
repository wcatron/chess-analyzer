import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export const Svg = () => {
  return (
    <svg
      style={{
        border: "2px solid gold",
      }}
    />
  );
};

export const Circle = () => {
  const ref = useRef(null);

  useEffect(() => {
    d3.select(ref.current)
      .append("circle")
      .attr("cx", 150)
      .attr("cy", 70)
      .attr("r", 50);
  });

  return <svg ref={ref} />;
};

const width = 420;
const height = 40;

export const Chart = ({
  data,
  myColor,
  loading,
  selectedMove,
  onHoverMove,
  onSelectMove,
}: {
  data: (number | string)[] | undefined;
  myColor: "black" | "white";
  loading: boolean;
  selectedMove?: number;
  onHoverMove?: (move: number) => void;
  onSelectMove?: (move: number) => void;
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const numberOfMoves = data?.length || 20;

    const mouseX = selectedMove && [selectedMove * (width / numberOfMoves)];
    const mouseG = d3.select(ref.current).select(".mouse-line");
    mouseG
      .style("stroke-width", Math.max(Math.round(width / numberOfMoves), 2))
      .style("opacity", selectedMove ? "1" : "0")
      .attr("d", function () {
        var d = "M" + mouseX + "," + height;
        d += " " + mouseX + "," + 0;
        return d;
      });
  }, [data?.length, selectedMove]);

  useEffect(() => {
    const numberOfMoves = data?.length || 20;

    const maxEval = 8.0;
    const minEval = -8.0;
    const xDomain = [0, numberOfMoves];
    const yDomain = [minEval, maxEval];

    const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);

    const lineGenerator = d3
      .line<number | string>()
      .curve(d3.curveMonotoneX)
      .x((_, index) => xScale(index));

    const evenLine = d3
      .line<Number>()
      .x((_, index) => xScale(index == 0 ? 0 : numberOfMoves))
      .y(() => yScale(0));

    d3.select(ref.current).selectAll("*").remove();
    d3.select(ref.current)
      .on("click", null)
      .on("mousemove", null)
      .on("mouseover", null)
      .on("mouseout", null);

    d3.select(ref.current)
      .append("path")
      .datum([0, 0])
      /* Pass the generated line to the `d` attribute */
      .attr("d", evenLine)
      /* Set some styles */
      .attr("stroke", "lightgrey")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("fill", "none");

    var mouseG = d3
      .select(ref.current)
      .append("g")
      .attr("class", "mouse-over-effects");

    const mouseX = selectedMove && [selectedMove * (width / numberOfMoves)];

    mouseG
      .append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", Math.max(Math.round(width / numberOfMoves), 2))
      .style("opacity", selectedMove ? "1" : "0")
      .attr("d", function () {
        var d = "M" + mouseX + "," + height;
        d += " " + mouseX + "," + 0;
        return d;
      });

    d3.select(ref.current)
      .on("mousemove", function (e) {
        // mouse moving over canvas
        var mouse = d3.pointer(e);
        const move = Math.round(mouse[0] / (width / numberOfMoves));
        if (typeof onHoverMove === "function") {
          onHoverMove(move);
        }
        d3.select(ref.current).select(".mouse-line");
      })
      .on("click", function (e) {
        var mouse = d3.pointer(e);
        const move = Math.round(mouse[0] / (width / numberOfMoves));
        if (typeof onSelectMove === "function") {
          onSelectMove(move);
        }
      });

    if (!loading && data) {
      const parseString = (m: string) => {
        if (m == "M0") {
          return data.length % 2 ? maxEval : minEval;
        }
        return parseInt(m.split("M")[1]) > 0 ? maxEval : minEval;
      };
      d3.select(ref.current)
        .append("path")
        .datum(data.concat([0]))
        /* Pass the generated line to the `d` attribute */
        .attr(
          "d",
          lineGenerator.y((d, index) =>
            typeof d === "string"
              ? yScale(Math.min(Math.max(parseString(d), 0)))
              : yScale(Math.min(Math.max(d, 0), maxEval))
          )
        )
        /* Set some styles */
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("fill", "white")
        .attr("opacity", 0.5);

      d3.select(ref.current)
        .append("path")
        .datum(data.concat([0]))
        /* Pass the generated line to the `d` attribute */
        .attr(
          "d",
          lineGenerator.y((d, index) =>
            typeof d === "string"
              ? yScale(Math.min(Math.max(parseString(d), minEval), 0))
              : yScale(Math.min(Math.max(d, minEval), 0))
          )
        )
        /* Set some styles */
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("fill", "black")
        .attr("opacity", 0.5);

      d3.select(ref.current)
        .append("path")
        .datum(data)
        /* Pass the generated line to the `d` attribute */
        .attr(
          "d",
          lineGenerator.y((d) =>
            typeof d === "string"
              ? yScale(parseString(d))
              : yScale(Math.min(Math.max(d, minEval), maxEval))
          )
        )
        .attr("interpolate", "monotone")
        /* Set some styles */
        .attr("stroke", myColor)
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("fill", "none");
    }
  }, [loading, data, myColor, onHoverMove]);

  return (
    <svg
      style={{
        width: 420,
        height: 40,
      }}
      ref={ref}
    />
  );
};
