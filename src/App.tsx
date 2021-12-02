import { useEffect, useState } from 'react'

import { TRIGHT, TLEFT, TUP, TDOWN } from './type'
import { RIGHT, LEFT, UP, DOWN } from './constants'
import Snake from './Snake'
import Food from './Food'

const getRandomCoordinates: () => [number, number] = () => {
  const min = 1
  const max = 90
  const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
  const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
  return [x, y]
}

const initialStates: {
  snakeDots: [number, number][]
  speed: number
  direction: TRIGHT | TLEFT | TUP | TDOWN
  food: () => [number, number]
} = {
  snakeDots: [
    [0, 0],
    [2, 0],
  ],
  speed: 200,
  direction: RIGHT,
  food: getRandomCoordinates,
}

export default function App() {
  // [[x, y]]: x is the coordinate followed x axis, y is the coordinate followed y axis
  const [snakeDots, setSnakeDots] = useState<[number, number][]>([
    [0, 0],
    [2, 0],
  ])
  const [food, setFood] = useState<[number, number]>(initialStates.food())
  const [direction, setDirection] = useState<TRIGHT | TLEFT | TUP | TDOWN>(
    initialStates.direction
  )
  const [speed, setSpeed] = useState<number>(200)

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [direction])

  useEffect(() => {
    const snakeMoving = setInterval(moveSnake, speed)
    return () => {
      clearInterval(snakeMoving)
    }
  }, [snakeDots, direction])

  useEffect(() => {
    checkIfOutOfBorders()
    checkIfCollapsed()
    checkIfEat()
  }, [snakeDots, direction])

  const handleKeyDown = (e: KeyboardEvent) => {
    e = e || window.event
    switch (e.key) {
      case 'ArrowUp': {
        if (direction === DOWN) return
        setDirection(UP)
        break
      }
      case 'ArrowDown': {
        if (direction === UP) return
        setDirection(DOWN)
        break
      }
      case 'ArrowLeft': {
        if (direction === RIGHT) return
        setDirection(LEFT)
        break
      }
      case 'ArrowRight': {
        if (direction === LEFT) return
        setDirection(RIGHT)
        break
      }
    }
  }

  const moveSnake = () => {
    let dots = [...snakeDots]
    let head = dots[dots.length - 1]

    switch (direction) {
      case UP: {
        head = [head[0], head[1] - 2]
        break
      }
      case DOWN: {
        head = [head[0], head[1] + 2]
        break
      }
      case LEFT: {
        head = [head[0] - 2, head[1]]
        break
      }
      case RIGHT: {
        head = [head[0] + 2, head[1]]
        break
      }
    }

    dots.push(head) // Add new head
    dots.shift() // Remove tail

    setSnakeDots(dots)
  }

  const checkIfOutOfBorders = () => {
    let head = snakeDots[snakeDots.length - 1]
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver()
    }
  }

  const checkIfCollapsed = () => {
    let snake = [...snakeDots]
    let head = snake[snake.length - 1]
    snake.pop()
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver()
      }
    })
  }

  const checkIfEat = () => {
    let head = snakeDots[snakeDots.length - 1]
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(initialStates.food())
      enlargeSnake()
      increaseSpeed()
    }
  }

  const enlargeSnake = () => {
    let newSlake = [...snakeDots]
    newSlake.unshift([] as unknown as [number, number])
    setSnakeDots(newSlake)
  }

  const onGameOver = () => {
    alert(`Game over. Snake length is ${snakeDots.length}`)
    resetState()
  }

  const increaseSpeed = () => {
    if (speed > 10) {
      setSpeed(prevSpeed => prevSpeed - 10)
    }
  }

  const resetState = () => {
    setSpeed(initialStates.speed)
    setSnakeDots(initialStates.snakeDots)
    setDirection(initialStates.direction)
  }

  return (
    <div className="game-area">
      <Snake snakeDots={snakeDots} />
      <Food dot={food} />
    </div>
  )
}
