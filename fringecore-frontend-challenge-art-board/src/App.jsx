import React, { useRef, useState, useEffect } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // 'pen' or 'eraser'

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }, []);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "pen") {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    } else if (tool === "eraser") {
      const eraserSize = 20; // Eraser size
      ctx.clearRect(
        e.nativeEvent.offsetX - eraserSize / 2,
        e.nativeEvent.offsetY - eraserSize / 2,
        eraserSize,
        eraserSize
      );
    }
  };

  const handleMouseUp = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
  };

  return (
    <div>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          cursor: tool === "pen" ? "crosshair" : "pointer",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDrawing(false)} // Stop drawing on mouse leave
      />

      {/* Toolbar */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 10, // Ensure toolbar is above the canvas
        }}
      >
        <button
          onClick={() => setTool("pen")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🖊️ Pen
        </button>
        <button
          onClick={() => setTool("eraser")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🧹 Eraser
        </button>
      </div>
    </div>
  );
};

export default App;
