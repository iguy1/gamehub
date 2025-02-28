"use client"
import GameCanvas from "@/components/game-canvas"
import GameUI from "@/components/game-ui"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="relative w-full max-w-4xl">
        <h1 className="mb-6 text-center font-mono text-4xl font-bold text-red-500 md:text-6xl">SURVIV.IO CLONE</h1>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-4 border-gray-700 bg-green-800">
          <GameCanvas />
          <GameUI />
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>WASD or Arrow Keys to move | Mouse to aim | Click to shoot</p>
          <p className="mt-2">Collect weapons and supplies. Be the last one standing!</p>
        </div>
      </div>
    </main>
  )
}

