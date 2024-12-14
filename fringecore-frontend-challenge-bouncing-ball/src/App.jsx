import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const ballRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLaunched, setIsLaunched] = useState(false);
  const [isBallStopped, setIsBallStopped] = useState(false); // State to check if the ball is stopped
  const [isStarted, setIsStarted] = useState(false); // New state for game start
  let animationFrameId = null;

  // Ball movement variables
  let x = 0,
    y = 0,
    dx = 0,
    dy = 0,
    gravity = 0.4,
    bounceFactor = 0.7;
  const speed = 12; // Speed of the ball

  useEffect(() => {
    const ball = ballRef.current;
    const canvas = canvasRef.current;

    // Set ball to initial position at center
    if (ball) {
      x = canvas.clientWidth / 2 - 22;
      y = canvas.clientHeight / 2 - 22;
      ball.style.left = `${x}px`;
      ball.style.top = `${y}px`;
    }
  }, []);

  const moveBallToClick = (event) => {
    if (!isStarted) {
      setIsStarted(true); // Game started on first click
      setIsLaunched(true);
      setIsBallStopped(false);
      startBallMovement(event);
    } else {
      // Ball movement after first click
      startBallMovement(event);
    }
  };

  const startBallMovement = (event) => {
    const canvas = canvasRef.current;
    const ball = ballRef.current;

    if (!ball || !canvas) return;

    // Get click position
    const clickX = event.clientX - 22; // Offset for ball size (22px radius)
    const clickY = event.clientY - 22;

    // Calculate direction vector (from ball to click position)
    const deltaX = clickX - x;
    const deltaY = clickY - y;
    const magnitude = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    // Normalize direction and set velocity (dx, dy)
    dx = (deltaX / magnitude) * speed;
    dy = (deltaY / magnitude) * speed;

    setIsLaunched(true);
    setIsBallStopped(false); // Ball is now moving
    animateBall();
  };

  const animateBall = () => {
    const ball = ballRef.current;
    const canvas = canvasRef.current;

    if (!ball || !canvas) return;

    const animate = () => {
      dy += gravity; // Apply gravity
      x += dx; // Update x position
      y += dy; // Update y position

      // Ball collision with bottom
      if (y + 44 > canvas.clientHeight) {
        y = canvas.clientHeight - 44;
        dy = -dy * bounceFactor;
        dx *= bounceFactor; // Reduce horizontal speed
      }

      // Ball collision with top
      if (y < 0) {
        y = 0;
        dy = -dy * bounceFactor;
      }

      // Ball collision with right or left walls
      if (x + 44 > canvas.clientWidth || x < 0) {
        dx = -dx * bounceFactor;
      }

      // Update ball position
      ball.style.left = `${x}px`;
      ball.style.top = `${y}px`;

      // Stop animation if ball is almost stationary
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        setIsBallStopped(true); // Mark ball as stopped
        return;
      }

      // Continue animation if ball is still moving
      animationFrameId = requestAnimationFrame(animate);
    };

    cancelAnimationFrame(animationFrameId); // Avoid duplicate animations
    animationFrameId = requestAnimationFrame(animate);
  };

  return (
    <div
      id="canvas"
      ref={canvasRef}
      onClick={moveBallToClick}
    >
      <div ref={ballRef} id="ball"></div>
      {!isLaunched && !isStarted && (
        <div id="instructions">Click to Start</div> // Show instruction before starting
      )}
      {isBallStopped && (
        <div id="instructions">Click anywhere to launch the ball!</div>
      )}
    </div>
  );
};

export default App;
