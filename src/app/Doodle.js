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
  const [lineColor, setLineColor] = useState("#000000");
  const [lineOpacity, setLineOpacity] = useState(0.5);

  const prevPositionRef = useRef([]);

  const defineLine = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");

    // Commenting these out as it creates little dots when drawing
    // ctx.lineCap = "round";
    // ctx.lineJoin = "round";
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

  const onCanvasEnter = (e) => {
    if (isDrawing) {
      ctxRef.current.beginPath();
      ctxRef.current.stroke();
    }
  };

  const onCanvasLeave = (e) => {
    if (isDrawing) {
      ctxRef.current.closePath();
      prevPositionRef.current = {};
    }
  };

  const onStartDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();

    prevPositionRef.current = {
      coord: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
    };
    setIsDrawing(true);
  };

  const onDraw = (e) => {
    if (isDrawing) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(
        prevPositionRef.current?.coord?.[0],
        prevPositionRef.current?.coord?.[1]
      );
      ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctxRef.current.stroke();

      prevPositionRef.current = {
        coord: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
      };
    }
  };

  const onStopDrawing = (e) => {
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    ctxRef.current.stroke();
    ctxRef.current.closePath();
    setIsDrawing(false);
    prevPositionRef.current = {};
  };

  const offsetXAndY = (pageX, pageY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return [pageX - rect.left, pageY - rect.top];
  };

  const startTouchDrawing = (evt) => {
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      ctxRef.current.beginPath();
      ctxRef.current.fill();
      prevPositionRef.current = {
        coord: offsetXAndY(touches[i].pageX, touches[i].pageY),
        identifier: touches[i].identifier,
      };
    }
  };

  const drawTouch = (evt) => {
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      if (touches[i].identifier === prevPositionRef.current?.identifier) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(
          prevPositionRef.current?.coord?.[0],
          prevPositionRef.current?.coord?.[1]
      );
        ctxRef.current.lineTo(
          ...offsetXAndY(touches[i].pageX, touches[i].pageY)
        );
      ctxRef.current.stroke();

        prevPositionRef.current = {
          coord: offsetXAndY(touches[i].pageX, touches[i].pageY),
          identifier: touches[i].identifier,
        };
      }
    }
  };

  const endTouchDrawing = (evt) => {
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      if (touches[i].identifier === prevPositionRef.current?.identifier) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(
          prevPositionRef.current?.coord?.[0],
          prevPositionRef.current?.coord?.[1]
      );
        ctxRef.current.lineTo(
          ...offsetXAndY(touches[i].pageX, touches[i].pageY)
        );
      ctxRef.current.stroke();
      }
    }

    ctxRef.current.closePath();
    prevPositionRef.current = {};
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
    <div
      className="doodle-app w-full h-screen flex flex-col justify-start items-center bg-gray-100 font-mono"
      onMouseUp={() => setIsDrawing(false)}
    >
      <div className="flex">
        <Image
          className="dark:invert"
          src="/doodle/brush.svg"
          alt="Brush"
          width={48}
          height={48}
          style={{ width: "auto", height: "auto" }}
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
          onMouseDown={onStartDrawing}
          onMouseUp={onStopDrawing}
          onMouseLeave={onCanvasLeave}
          onMouseEnter={onCanvasEnter}
          onMouseMove={onDraw}
          onTouchStart={startTouchDrawing}
          onTouchEnd={endTouchDrawing}
          onTouchMove={drawTouch}
          ref={canvasRef}
        />
      </div>
    </div>
  );
}

export default Draw;
