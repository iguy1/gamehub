"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const CANVAS_SIZE = 400;
const SQUARE_SIZE = CANVAS_SIZE / 8;

const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const ChessGame = () => {
  const canvasRef = useRef(null);
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);

  const drawBoard = useCallback(
    (ctx) => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          ctx.fillStyle = (row + col) % 2 === 0 ? "#f0d9b5" : "#b58863";
          ctx.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

          const piece = board[row][col];
          if (piece) {
            ctx.fillStyle = piece === piece.toUpperCase() ? "white" : "black";
            ctx.font = `${SQUARE_SIZE * 0.7}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              getPieceSymbol(piece),
              col * SQUARE_SIZE + SQUARE_SIZE / 2,
              row * SQUARE_SIZE + SQUARE_SIZE / 2
            );
          }
        }
      }
    },
    [board]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawBoard(ctx);

    if (!playerTurn) {
      // AI move
      setTimeout(() => {
        const newBoard = makeRandomMove(board);
        setBoard(newBoard);
        setPlayerTurn(true);
      }, 500);
    }
  }, [board, playerTurn, drawBoard]);

  const handleCanvasClick = (event) => {
    if (!playerTurn) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / SQUARE_SIZE);
    const row = Math.floor(y / SQUARE_SIZE);

    if (selectedPiece) {
      const newBoard = movePiece(board, selectedPiece.row, selectedPiece.col, row, col);
      if (newBoard) {
        setBoard(newBoard);
        setSelectedPiece(null);
        setPlayerTurn(false);
      } else {
        setSelectedPiece(null);
      }
    } else {
      const piece = board[row][col];
      if (piece && piece === piece.toUpperCase()) {
        setSelectedPiece({ row, col });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Chess Game</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onClick={handleCanvasClick}
        className="border border-gray-300 shadow-lg"
      />
      <p className="mt-4 text-xl">{playerTurn ? "Your turn" : "AI is thinking..."}</p>
    </div>
  );
};

function getPieceSymbol(piece) {
  const symbols = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
    null: "",
  };
  return symbols[piece] || "";
}

function movePiece(board, fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  if (!piece || !isValidMove(board, fromRow, fromCol, toRow, toCol)) {
    return null;
  }

  const newBoard = board.map((row) => [...row]);
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;
  return newBoard;
}

function isValidMove(board, fromRow, fromCol, toRow, toCol) {
  // Implement chess rules here
  // This is a simplified version that only checks if the destination is empty or an opponent's piece
  const piece = board[fromRow][fromCol];
  const destPiece = board[toRow][toCol];

  if (!piece) return false;
  if (destPiece && destPiece.toUpperCase() === piece.toUpperCase()) return false;

  // Add more specific rules for each piece type here

  return true;
}

function makeRandomMove(board) {
  const newBoard = board.map((row) => [...row]);
  const blackPieces = [];

  // Find all black pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece === piece.toLowerCase()) {
        blackPieces.push({ row, col, piece });
      }
    }
  }

  // Try to make a valid move
  while (blackPieces.length > 0) {
    const randomIndex = Math.floor(Math.random() * blackPieces.length);
    const { row, col, piece } = blackPieces[randomIndex];

    const possibleMoves = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    for (const move of possibleMoves) {
      if (
        move.row >= 0 &&
        move.row < 8 &&
        move.col >= 0 &&
        move.col < 8 &&
        isValidMove(board, row, col, move.row, move.col)
      ) {
        newBoard[move.row][move.col] = piece;
        newBoard[row][col] = null;
        return newBoard;
      }
    }

    blackPieces.splice(randomIndex, 1);
  }

  return board; // No valid moves found
}

export default ChessGame;