"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Menu from "./components/Menu";
import Image from "next/image";
import "./doodle.css";

function Draw() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(7);
  const [lineColor, setLineColor] = useState("#00000");
  const [lineOpacity, setLineOpacity] = useState(0.5);

  const defineLine = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);

  const sizeCanvas = () => {
    const drawAreaElement = document.querySelector(".draw-area");

    canvasRef.current.style.width = drawAreaElement.width;
    canvasRef.current.style.height = drawAreaElement.height;
    canvasRef.current.width = drawAreaElement.offsetWidth;
    canvasRef.current.height = drawAreaElement.offsetHeight;
  };

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();

    setIsDrawing(true);
  };

  const endDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (isDrawing) {
      ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

      ctxRef.current.stroke();
    }
  };

  const clearDrawing = () => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  useEffect(() => {
    sizeCanvas();
  }, []);

  useEffect(() => {
    defineLine();
  }, [lineColor, lineOpacity, lineWidth]);

  return (
    <div className="doodle-app w-full h-screen flex flex-col justify-start items-center bg-gray-100 font-mono">
      <div className="flex">
        <Image
          className="dark:invert"
          src="/doodle/brush.svg"
          alt="Brush"
          width={48}
          height={48}
        />
        <h1 className="ml-2 font-medium text-5xl text-black py-4">Doodle</h1>
      </div>

      <Menu
        lineColor={lineColor}
        setLineColor={setLineColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        lineOpacity={lineOpacity}
        setLineOpacity={setLineOpacity}
        clearDrawing={clearDrawing}
      />

      <div className="draw-area bg-white border-gray-200 border-2 relative cursor-cell">
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          ref={canvasRef}
        />
      </div>
    </div>
  );
}

export default Draw;
