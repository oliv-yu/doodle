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
  const [ongoingTouches, setOngoingTouches] = useState([]);

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

  const onCanvasEnter = (e) => {
    if (isDrawing) {
      ctxRef.current.beginPath();
      ctxRef.current.stroke();
    }
  };

  const onCanvasLeave = (e) => {
    if (isDrawing) {
      ctxRef.current.closePath();
    }
  };

  const onStartDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();

    setIsDrawing(true);
  };

  const onDraw = (e) => {
    if (isDrawing) {
      ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

      ctxRef.current.stroke();
    }
  };

  const onStopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const copyTouch = ({ identifier, pageX, pageY }) => {
    return { identifier, pageX, pageY };
  };

  const offsetXAndY = (pageX, pageY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return [pageX - rect.left, pageY - rect.top];
  };

  const ongoingTouchIndexById = (idToFind) => {
    for (let i = 0; i < ongoingTouches.length; i++) {
      const id = ongoingTouches[i].identifier;

      if (id === idToFind) {
        return i;
      }
    }
    return -1; // not found
  };

  const startTouchDrawing = (evt) => {
    evt.preventDefault();

    console.log("touchstart.");
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      console.log(`touchstart: ${i}.`);
      setOngoingTouches([...ongoingTouches, copyTouch(touches[i])]);
      ctxRef.current.beginPath();
      ctxRef.current.fill();
    }
  };

  const drawTouch = (evt) => {
    evt.preventDefault();

    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const idx = ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
        console.log(`continuing touch ${idx}`);
        ctxRef.current.beginPath();
        console.log(
          `ctx.moveTo( ${offsetXAndY(
            ongoingTouches[idx].pageX,
            ongoingTouches[idx].pageY
          )} );`
        );
        ctxRef.current.moveTo(
          ...offsetXAndY(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY)
        );
        console.log(
          `ctx.lineTo( ${offsetXAndY(touches[i].pageX, touches[i].pageY)} );`
        );
        ctxRef.current.lineTo(
          ...offsetXAndY(touches[i].pageX, touches[i].pageY)
        );
        ctxRef.current.stroke();

        setOngoingTouches(
          ongoingTouches.toSpliced(idx, 1, copyTouch(touches[i]))
        ); // swap in the new touch record
      } else {
        console.log("can't figure out which touch to continue");
      }
    }
  };

  const endTouchDrawing = (evt) => {
    evt.preventDefault();

    console.log("touchend");
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(
          ...offsetXAndY(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY)
        );
        ctxRef.current.lineTo(
          ...offsetXAndY(touches[i].pageX, touches[i].pageY)
        );

        setOngoingTouches(ongoingTouches.filter((_, i) => i !== idx));
      } else {
        console.log("can't figure out which touch to end");
      }
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
