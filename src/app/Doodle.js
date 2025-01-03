"use client";

import { useEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import Image from "next/image";
import "./doodle.css";

function Draw() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);

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

  return (
    <div className="doodle-app flex flex-col justify-start items-center bg-gray-100">
      <div className="flex">
        <Image
          className="dark:invert"
          src="/brush.svg"
          alt="Brush"
          width={48}
          height={48}
        />
        <h1 className="ml-2 font-sans font-medium text-5xl text-black py-4">
          Doodle
        </h1>
      </div>

      <div className="draw-area bg-white border-gray-200 border-2 relative">
        <Menu
          setLineColor={setLineColor}
          setLineWidth={setLineWidth}
          setLineOpacity={setLineOpacity}
          clearDrawing={clearDrawing}
        />

        <canvas
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          ref={canvasRef}
          width={`1280px`}
          height={`720px`}
        />
      </div>
    </div>
  );
}

export default Draw;
