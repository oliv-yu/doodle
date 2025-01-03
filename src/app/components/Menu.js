import React from "react";
import "../doodle.css";

const Menu = ({ clearDrawing, setLineColor, setLineWidth, setLineOpacity }) => {
  return (
    <div className="menu flex border-4 justify-evenly rounded my-4 items-center mx-auto text-zinc-900 font-light">
      <div className="flex">
        <label>Brush Color</label>
        <input
          className="ml-2"
          type="color"
          onChange={(e) => {
            setLineColor(e.target.value);
          }}
        />
      </div>

      <div className="flex">
        <label>Brush Width</label>
        <input
          className="ml-2"
          type="range"
          min="3"
          max="20"
          onChange={(e) => {
            setLineWidth(e.target.value);
          }}
        />
      </div>

      <div className="flex">
        <label>Brush Opacity</label>
        <input
          className="ml-2"
          type="range"
          min="1"
          max="100"
          onChange={(e) => {
            setLineOpacity(e.target.value / 100);
          }}
        />
      </div>

      <div>
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
