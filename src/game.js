"use client";

import { useEffect, useRef, useState } from "react";
import "./game-styles.css";
import React from "react";

export default function Game() {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [character, setCharacter] = useState("mordecai");
  const [gameOver, setGameOver] = useState(false);

  const [player, setPlayer] = useState({
    x: 50,
    y: 300,
    width: 50,
    height: 70,
    speed: 5,
    jumping: false,
    velocityY: 0,
    character: "mordecai",
  });

  const [collectibles, setCollectibles] = useState([]);
  const [obstacles, setObstacles] = useState([]);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animationFrameId;
    const gravity = 0.5;
    const jumpForce = -12;

    const drawGridBackground = () => {
      ctx.fillStyle = "#A1A1AA";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#71717A";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawCharacter = (x, y, width, height, character) => {
      if (character === "mordecai") {
        ctx.fillStyle = "blue";
      } else {
        ctx.fillStyle = "brown";
      }
      ctx.fillRect(x, y, width, height);
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGridBackground();
      const newPlayer = { ...player };
      if (newPlayer.jumping) {
        newPlayer.velocityY += gravity;
        newPlayer.y += newPlayer.velocityY;
        if (newPlayer.y > 300) {
          newPlayer.y = 300;
          newPlayer.jumping = false;
          newPlayer.velocityY = 0;
        }
      }
      drawCharacter(newPlayer.x, newPlayer.y, newPlayer.width, newPlayer.height, newPlayer.character);
      setPlayer(newPlayer);

      // Update and draw collectibles
      const newCollectibles = collectibles.filter((c) => !c.collected && c.x > -c.width);
      newCollectibles.forEach((collectible) => {
        collectible.x -= 2;
        if (
          !collectible.collected &&
          newPlayer.x < collectible.x + collectible.width &&
          newPlayer.x + newPlayer.width > collectible.x &&
          newPlayer.y < collectible.y + collectible.height &&
          newPlayer.y + newPlayer.height > collectible.y
        ) {
          collectible.collected = true;
          setScore((prev) => prev + 10);
        }
        if (!collectible.collected) {
          ctx.fillStyle = "green";
          ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
        }
      });

      // Update and draw obstacles
      const newObstacles = obstacles.filter((obstacle) => obstacle.x > -obstacle.width);
      let collision = false;
      newObstacles.forEach((obstacle) => {
        obstacle.x -= 3;
        if (
          newPlayer.x < obstacle.x + obstacle.width &&
          newPlayer.x + newPlayer.width > obstacle.x &&
          newPlayer.y < obstacle.y + obstacle.height &&
          newPlayer.y + newPlayer.height > obstacle.y
        ) {
          collision = true;
        }
        ctx.fillStyle = "red";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      if (collision) {
        setGameOver(true);
        setGameStarted(false);
        return;
      }

      // Spawn new collectibles
      if (Math.random() < 0.01) {
        const newCollectible = {
          x: canvas.width,
          y: Math.random() * (canvas.height - 150) + 50,
          width: 25,
          height: 25,
          collected: false,
        };
        newCollectibles.push(newCollectible);
      }

      // Spawn new obstacles
      if (Math.random() < 0.005) {
        const newObstacle = {
          x: canvas.width,
          y: Math.random() * (canvas.height - 150) + 50,
          width: 30,
          height: 30,
        };
        newObstacles.push(newObstacle);
      }

      setCollectibles(newCollectibles);
      setObstacles(newObstacles);

      // Draw score
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.strokeText(`Score: ${score}`, canvas.width - 150, 30);
      ctx.fillText(`Score: ${score}`, canvas.width - 150, 30);

      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStarted, player, collectibles, obstacles, score]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayer((prev) => ({
      ...prev,
      x: 50,
      y: 300,
      jumping: false,
      velocityY: 0,
      character,
    }));
    setCollectibles([]);
    setObstacles([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !player.jumping) {
        setPlayer((prev) => ({
          ...prev,
          jumping: true,
          velocityY: -12, // Use jumpForce here
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={400} />
      <button onClick={startGame}>Start Game</button>
      <div>
        <button onClick={() => setCharacter("mordecai")}>Mordecai</button>
        <button onClick={() => setCharacter("rigby")}>Rigby</button>
      </div>
      {gameOver && <div>Game Over! Final Score: {score}</div>}
    </div>
  );
}