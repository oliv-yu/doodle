import React from "react";
import "../doodle.css";

const Menu = ({
  clearDrawing,
  downloadImage,
  lineColor,
  lineWidth,
  setLineColor,
  setLineWidth,
  undo,
}) => {
  return (
    <div className="menu flex border-4 justify-evenly rounded my-3 items-center mx-auto text-zinc-900 font-light text-xs">
      <div className="flex items-center p-1">
        <label htmlFor="brush-color">Brush Color</label>
        <input
          id="brush-color"
          className="ml-2"
          type="color"
          onChange={(e) => {
            setLineColor(e.target.value);
          }}
          value={lineColor}
        />
      </div>

      <div className="flex items-center p-1">
        <label htmlFor="brush-width">Brush Width</label>
        <input
          className="ml-2"
          id="brush-width"
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
        <button
          aria-label="Clear Drawing"
          className="py-1 px-3 mr-2"
          onClick={clearDrawing}
        >
          Clear
        </button>

        <button aria-label="Undo" className="py-1 px-3 mr-2" onClick={undo}>
          Undo
        </button>

        <button
          aria-label="Download"
          className="py-1 px-3"
          onClick={downloadImage}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default Menu;
