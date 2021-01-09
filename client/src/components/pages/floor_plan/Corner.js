import React from "react";

const Corner = ({ at: { x, y }, thickness }) => (
  <circle
    cx={x}
    cy={y}
    r={thickness}
    stroke="black"
    strokeWidth={thickness / 3}
    fill="yellow"
  />
);

export default Corner;