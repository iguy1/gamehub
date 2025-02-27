import React, { useState, useEffect } from 'react';
import './coptergame.css'; // We'll define styles here

const COPTER_SPEED = 5;
const WATER_DROP_SPEED = 6;

const Game = () => {
  // State for the game world
  const [world, setWorld] = useState({
    copter: { x: 50, y: window.innerHeight / 3, flipped: true },
    copterSpeed: COPTER_SPEED,
    drops: [],
    fires: [],
    score: 0,
    gameOver: false,
  });

  // Handle keyboard input
  const handleKeyPress = (e) => {
    if (world.gameOver) return;

    if (e.key === 'ArrowLeft') {
      setWorld((prev) => ({
        ...prev,
        copterSpeed: -COPTER_SPEED,
        copter: { ...prev.copter, flipped: false },
      }));
    } else if (e.key === 'ArrowRight') {
      setWorld((prev) => ({
        ...prev,
        copterSpeed: COPTER_SPEED,
        copter: { ...prev.copter, flipped: true },
      }));
    } else if (e.key === ' ') {
      setWorld((prev) => ({
        ...prev,
        drops: [...prev.drops, { x: prev.copter.x, y: prev.copter.y + 20 }],
      }));
    }
  };

  // Game loop using useEffect
  useEffect(() => {
    const gameLoop = () => {
      if (world.gameOver) return;

      setWorld((prev) => {
        // Move copter
        let newCopterX = prev.copter.x + prev.copterSpeed;
        let newCopterSpeed = prev.copterSpeed;
        if (newCopterX > window.innerWidth - 50) {
          newCopterX = window.innerWidth - 50;
          newCopterSpeed = -COPTER_SPEED;
        } else if (newCopterX < 0) {
          newCopterX = 0;
          newCopterSpeed = COPTER_SPEED;
        }

        // Move water drops
        const updatedDrops = prev.drops
          .map((drop) => ({ ...drop, y: drop.y + WATER_DROP_SPEED }))
          .filter((drop) => drop.y < window.innerHeight);

        // Spawn fires randomly
        const newFires =
          Math.random() < 0.02 && prev.fires.length < 10
            ? [
                ...prev.fires,
                {
                  x: Math.floor(Math.random() * window.innerWidth),
                  y: window.innerHeight - 20,
                  size: 10,
                },
              ]
            : prev.fires;

        // Grow fires
        const grownFires = newFires.map((fire) => ({
          ...fire,
          size: fire.size + 0.01 + 0.001 * prev.score,
        }));

        // Check for collisions and update score
        const dropsToKeep = [];
        const firesToKeep = [];
        let newScore = prev.score;

        updatedDrops.forEach((drop) => {
          let hit = false;
          grownFires.forEach((fire) => {
            if (
              Math.abs(drop.x - fire.x) < fire.size &&
              Math.abs(drop.y - fire.y) < fire.size
            ) {
              hit = true;
              newScore += 1;
            }
          });
          if (!hit) dropsToKeep.push(drop);
        });

        grownFires.forEach((fire) => {
          if (
            !updatedDrops.some(
              (drop) =>
                Math.abs(drop.x - fire.x) < fire.size &&
                Math.abs(drop.y - fire.y) < fire.size
            )
          ) {
            firesToKeep.push(fire);
          }
        });

        // Check for game over
        const gameOver = grownFires.some((fire) => fire.size >= 50);

        return {
          ...prev,
          copter: { ...prev.copter, x: newCopterX },
          copterSpeed: newCopterSpeed,
          drops: dropsToKeep,
          fires: firesToKeep,
          score: newScore,
          gameOver,
        };
      });
    };

    const interval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [world.gameOver, handleKeyPress]);

  return (
    <div className="game-container">
      <div className="score">
        {world.gameOver
          ? `GAME OVER! Your score was ${world.score}`
          : `Score: ${world.score}`}
      </div>
      {/* Copter */}
      <div
        className="copter"
        style={{
          left: `${world.copter.x}px`,
          top: `${world.copter.y}px`,
          transform: world.copter.flipped ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        🚁
      </div>
      {/* Water Drops */}
      {world.drops.map((drop, index) => (
        <div
          key={index}
          className="drop"
          style={{ left: `${drop.x}px`, top: `${drop.y}px` }}
        />
      ))}
      {/* Fires */}
      {world.fires.map((fire, index) => (
        <div
          key={index}
          className="fire"
          style={{
            left: `${fire.x}px`,
            top: `${fire.y - fire.size}px`,
            width: `${fire.size}px`,
            height: `${fire.size}px`,
          }}
        >
          🔥
        </div>
      ))}
    </div>
  );
};

export default Game;