"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Menu from "./components/Menu";
import NextImage from "next/image";
import "./doodle.css";

function Draw() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(7);
  const [lineColor, setLineColor] = useState("#000000");
  const [history, setHistory] = useState([]);

  const prevPositionRef = useRef({});

  const defineLine = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    ctxRef.current = ctx;
  }, [lineColor, lineWidth]);

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

    saveHistory();
    setIsDrawing(false);
    prevPositionRef.current = {};
  };

  const saveHistory = () => {
    setHistory([...history, canvasRef.current.toDataURL()]);
  };

  const undo = () => {
    if (history.length === 1) {
      clearDrawing();
      setHistory([]);
    } else if (history.length > 1) {
      const img = new Image();
      img.src = history[history.length - 2];

      img.onload = function () {
        clearDrawing();
        ctxRef.current.drawImage(img, 0, 0);
      };

      setHistory(history.slice(0, -1));
    }
  };

  const offsetXAndY = (touch) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return [touch.clientX - rect.left, touch.clientY - rect.top];
  };

  const startTouchDrawing = (evt) => {
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      ctxRef.current.beginPath();
      ctxRef.current.fill();
      prevPositionRef.current = {
        coord: offsetXAndY(touches[i]),
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
        ctxRef.current.lineTo(...offsetXAndY(touches[i]));
        ctxRef.current.stroke();

        prevPositionRef.current = {
          coord: offsetXAndY(touches[i]),
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
        ctxRef.current.lineTo(...offsetXAndY(touches[i]));
        ctxRef.current.stroke();
      }
    }

    saveHistory();
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

  const downloadImage = () => {
    const imageURL = canvasRef.current.toDataURL("image/png");

    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "doodle.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    sizeCanvas();
  }, []);

  useEffect(() => {
    defineLine();
  }, [lineColor, lineWidth]);

  return (
    <div
      className="doodle-app w-full h-screen flex flex-col justify-start items-center bg-gray-100 font-indie"
      onMouseUp={() => setIsDrawing(false)}
    >
      <div className="flex mt-3">
        <NextImage
          className="dark:invert brush-icon"
          src="/doodle/brush.svg"
          alt="Brush"
          width={30}
          height={30}
        />
        <h1 className="ml-2 font-medium text-4xl text-black">Doodle</h1>
      </div>

      <Menu
        lineColor={lineColor}
        setLineColor={setLineColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        clearDrawing={clearDrawing}
        downloadImage={downloadImage}
        undo={undo}
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
