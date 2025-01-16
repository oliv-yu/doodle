import React from "react";
import "../doodle.css";

const Menu = ({
  clearDrawing,
  lineColor,
  lineOpacity,
  lineWidth,
  setLineColor,
  setLineOpacity,
  setLineWidth,
}) => {
  return (
    <div className="menu flex border-4 justify-evenly rounded my-3 items-center mx-auto text-zinc-900 font-light text-xs">
      <div className="p-1">
        <label>Brush Color</label>
        <input
          className="ml-2"
          type="color"
          onChange={(e) => {
            setLineColor(e.target.value);
          }}
          value={lineColor}
        />
      </div>

      <div className="p-1">
        <label>Brush Width</label>
        <input
          className="ml-2"
          type="range"
          min="3"
          max="15"
          onChange={(e) => {
            setLineWidth(e.target.value);
          }}
          value={lineWidth}
        />
      </div>

      <div className="p-1">
        <label>Brush Opacity</label>
        <input
          className="ml-2"
          type="range"
          min="1"
          max="100"
          onChange={(e) => {
            setLineOpacity(e.target.value / 100);
          }}
          value={lineOpacity * 100}
        />
      </div>

      <div className="flex p-1 justify-center items-center">
        <button
          aria-label="Clear Drawing"
          className="py-1 px-3"
          onClick={clearDrawing}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Menu;
