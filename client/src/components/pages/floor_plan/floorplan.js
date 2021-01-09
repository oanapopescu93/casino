import React from "react";
import Room from "./Room";

const Floorplan = ({ data: { rooms } }) =>
  rooms.map((r) => <Room key={r.id} {...r} />);

export default Floorplan;
