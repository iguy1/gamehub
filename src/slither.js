"use client";

import { useEffect, useRef, useState } from "react";

// Constants for game settings
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const POINT_SIZE = 20;
const MOVEMENT_SPEED = 3;
const BOOST_SPEED = 5;
const AI_SNAKE_SPAWN_INTERVAL = 5000; // Spawn a new AI snake every 5 seconds

export default function SlitherGame() {
  const canvasRef = useRef(null);

  // Initial game state
  const [gameState, setGameState] = useState({
    player: {
      points: [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }],
      angle: 0,
      boosting: false,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      score: 10,
    },
    aiSnakes: [],
    pellets: [],
    mousePos: { x: 0, y: 0 },
    gameOver: false,
  });

  // Function to initialize the game
  const initializeGame = () => {
    // Create initial AI snakes
    const aiSnakes = Array.from({ length: 5 }, () => ({
      points: [{ x: Math.random() * CANVAS_WIDTH, y: Math.random() * CANVAS_HEIGHT }],
      angle: Math.random() * Math.PI * 2,
      boosting: false,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      score: 5,
    }));

    // Create initial pellets
    const pellets = Array.from({ length: 100 }, () => ({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    }));

    // Set the initial game state
    setGameState({
      player: {
        points: [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }],
        angle: 0,
        boosting: false,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        score: 10,
      },
      aiSnakes,
      pellets,
      mousePos: { x: 0, y: 0 },
      gameOver: false,
    });
  };

  // Initialize the game when the component mounts
  useEffect(() => {
    initializeGame();
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.gameOver) return;

    let animationFrameId;

    const update = () => {
      setGameState((prev) => {
        const speed = prev.player.boosting ? BOOST_SPEED : MOVEMENT_SPEED;
        const dx = Math.cos(prev.player.angle) * speed;
        const dy = Math.sin(prev.player.angle) * speed;

        // Update player position
        const newPlayerPoints = [...prev.player.points];
        newPlayerPoints.unshift({
          x: (newPlayerPoints[0].x + dx + CANVAS_WIDTH) % CANVAS_WIDTH,
          y: (newPlayerPoints[0].y + dy + CANVAS_HEIGHT) % CANVAS_HEIGHT,
        });

        // Remove excess points from the player's body
        while (newPlayerPoints.length > prev.player.score) {
          newPlayerPoints.pop();
        }

        // Update AI snakes positions
        const newAiSnakes = prev.aiSnakes.map((snake) => {
          const newAngle = snake.angle + (Math.random() - 0.5) * 0.2;
          const dx = Math.cos(newAngle) * MOVEMENT_SPEED;
          const dy = Math.sin(newAngle) * MOVEMENT_SPEED;

          const newPoints = [...snake.points];
          newPoints.unshift({
            x: (newPoints[0].x + dx + CANVAS_WIDTH) % CANVAS_WIDTH,
            y: (newPoints[0].y + dy + CANVAS_HEIGHT) % CANVAS_HEIGHT,
          });

          // Remove excess points from the AI snake's body
          while (newPoints.length > snake.score) {
            newPoints.pop();
          }

          return { ...snake, points: newPoints, angle: newAngle };
        });

        // Update pellets and check for collisions with the player
        const newPellets = [...prev.pellets];
        let newPlayerScore = prev.player.score;

        newPellets.forEach((pellet, index) => {
          const dx = pellet.x - prev.player.points[0].x;
          const dy = pellet.y - prev.player.points[0].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < POINT_SIZE) {
            newPlayerScore += 1;
            newPellets.splice(index, 1);
            newPellets.push({
              x: Math.random() * CANVAS_WIDTH,
              y: Math.random() * CANVAS_HEIGHT,
              color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            });
          }
        });

        let gameOver = false;
        const remainingAiSnakes = [];
        newAiSnakes.forEach((snake) => {
          let hitPlayer = false;
          snake.points.forEach((point) => {
            prev.player.points.forEach((playerPoint) => {
              const dx = point.x - playerPoint.x;
              const dy = point.y - playerPoint.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < POINT_SIZE) hitPlayer = true;
            });
          });

          if (hitPlayer) {
            newPlayerScore += snake.points.length;
            newPellets.push(
              ...snake.points.map((point) => ({
                x: point.x,
                y: point.y,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
              }))
            );
          } else {
            remainingAiSnakes.push(snake);
          }
        });

        // Check if player's head hits any AI snake's body
        newAiSnakes.forEach((snake) => {
          snake.points.forEach((point) => {
            const dx = point.x - newPlayerPoints[0].x;
            const dy = point.y - newPlayerPoints[0].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < POINT_SIZE) gameOver = true;
          });
        });

        return {
          ...prev,
          player: { ...prev.player, points: newPlayerPoints, score: newPlayerScore },
          aiSnakes: remainingAiSnakes,
          pellets: newPellets,
          gameOver,
        };
      });

      // Draw the game state on the canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          drawGame(ctx, gameState);
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  // Spawn new AI snakes at regular intervals
  useEffect(() => {
    if (gameState.gameOver) return;

    const spawnAiSnake = () => {
      setGameState((prev) => ({
        ...prev,
        aiSnakes: [
          ...prev.aiSnakes,
          {
            points: [{ x: Math.random() * CANVAS_WIDTH, y: Math.random() * CANVAS_HEIGHT }],
            angle: Math.random() * Math.PI * 2,
            boosting: false,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            score: 5,
          },
        ],
      }));
    };

    const intervalId = setInterval(spawnAiSnake, AI_SNAKE_SPAWN_INTERVAL);
    return () => clearInterval(intervalId);
  }, [gameState.gameOver]);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - gameState.player.points[0].x;
      const dy = y - gameState.player.points[0].y;
      const angle = Math.atan2(dy, dx);

      setGameState((prev) => ({
        ...prev,
        player: { ...prev.player, angle },
        mousePos: { x, y },
      }));
    };

    const handleMouseDown = () => setGameState((prev) => ({ ...prev, player: { ...prev.player, boosting: true } }));
    const handleMouseUp = () => setGameState((prev) => ({ ...prev, player: { ...prev.player, boosting: false } }));

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [gameState.player.points]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-black" />
      <div className="absolute top-4 left-4 text-white">Score: {gameState.player.score}</div>
      {gameState.gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75">
          <div className="text-white text-2xl">Game Over! Final Score: {gameState.player.score}</div>
          <button
            className="mt-4 px-4 py-2 bg-white text-black rounded"
            onClick={initializeGame}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

// Function to draw the game state on the canvas
function drawGame(ctx, state) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw pellets
  state.pellets.forEach((pellet) => {
    ctx.beginPath();
    ctx.fillStyle = pellet.color;
    ctx.arc(pellet.x, pellet.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw AI snakes
  state.aiSnakes.forEach((snake) => {
    ctx.fillStyle = snake.color;
    snake.points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, POINT_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // Draw player snake
  ctx.fillStyle = state.player.color;
  state.player.points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, POINT_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}