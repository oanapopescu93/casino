import React, { useMemo } from "react";
import Wall from "./Wall";
import Corner from "./Corner";

const WALL_THICKNESS = 200;

const Room = ({ id, coords }) => {
  const walls = useMemo(
    () =>
      coords.map((_, i) => {
        const a = coords[i];
        const b = coords[(i + 1) % coords.length];
        console.log('aaa', a, b, i)
        return [a, b, i];
      }),
      [coords]
    [coords]
  );
  return (
    <g>
      {walls.map(([a, b, i]) => (
        <Wall key={i} corner1={a} corner2={b} thickness={WALL_THICKNESS} />
      ))}
      {coords.map(coord => (
        <Corner
          key={`corner-${coord.x},${coord.y}`}
          at={coord}
          thickness={WALL_THICKNESS}
        />
      ))}
    </g>
  );
};

export default Room;
