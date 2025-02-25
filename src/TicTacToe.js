"use client"

import React, { useState, useEffect } from "react"
import "./TicTac.css"

const Button = ({ children, variant = "default", className = "", ...props }) => {
  const classes = `btn btn-${variant} ${className}`
  
  return (
    <button {...props} className={classes}>
      {children}
    </button>
  )
}

const Square = ({ value, onClick }) => {
  const classes = `game-square ${value === 'X' ? 'x-mark' : value === 'O' ? 'o-mark' : ''}`
  
  return (
    <button className={classes} onClick={onClick}>
      {value}
    </button>
  )
}

const Board = ({ squares, onClick }) => {
  return (
    <div className="game-board">
      {squares.map((square, i) => (
        <Square key={i} value={square} onClick={() => onClick(i)} />
      ))}
    </div>
  )
}

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    setWinner(calculateWinner(squares))
  }, [squares])

  const handleClick = (i) => {
    if (winner || squares[i]) return
    const newSquares = squares.slice()
    newSquares[i] = xIsNext ? "X" : "O"
    setSquares(newSquares)
    setXIsNext(!xIsNext)
  }

  const resetGame = () => {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setWinner(null)
  }

  const status = winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? "It's a draw!"
      : `Next player: ${xIsNext ? "X" : "O"}`

  return (
    <div className="game-container">
      <h1 className="game-title">Tic Tac Toe</h1>
      <Board squares={squares} onClick={handleClick} />
      <div className="game-status">{status}</div>
      <Button className="" onClick={resetGame}>
        Reset Game
      </Button>
    </div>
  )
}