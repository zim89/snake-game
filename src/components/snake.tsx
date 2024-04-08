'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import Controls from './controls';
import { Rating } from './rating';
import { Toolbar } from './toolbar';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import {
  GRID_SIZE,
  INITIAL_DIRECTION,
  INITIAL_SNAKE_LENGTH,
  INITIAL_SPEED
} from '@/lib/const';
import { createClient } from '@/lib/supabase/client';
import type { Direction, Point } from '@/lib/types';

export default function Snake({
  data
}: {
  data: {
    id: number;
    inserted_at: string;
    updated_at: string;
    username: string;
    score: number;
  }[];
}) {
  const [snake, setSnake] = useState<Point[]>([
    { x: 2, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 }
  ]);
  const [food, setFood] = useState<Point>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [score, setScore] = useState<number>(0);
  const [username, setUsername] = useState<string>('');

  const supabase = createClient();
  const ref = useRef<HTMLDivElement>(null);
  const route = useRouter();

  const moveSnake = (): void => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      newSnake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      setGameStarted(false);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 10);
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const initGame = (): void => {
    ref.current?.focus();
    const initialSnake: Point[] = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({ x: i, y: 0 });
    }
    setSnake(initialSnake);
    generateFood();
  };

  const generateFood = (): void => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    setFood({ x, y });
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!paused) {
      if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        setDirection('UP');
      }
      if (event.key === 'ArrowDown' && direction !== 'UP') {
        setDirection('DOWN');
      }
      if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        setDirection('LEFT');
      }
      if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        setDirection('RIGHT');
      }
    }

    if (event.code === 'Space') {
      setPaused(prev => !prev);
    }
  };

  const onGameStart = (): void => {
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setGameStarted(true);
    initGame();
  };

  const onSaveResults = async (): Promise<void> => {
    const { error } = await supabase
      .from('score')
      .insert({ username: username.trim(), score });
    setGameOver(false);
    route.refresh();
  };

  useEffect(() => {
    if (!gameOver && gameStarted && !paused) {
      ref.current?.focus();
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [gameStarted, snake, direction, paused]);

  useEffect(() => {
    if (score > 0 && score % 50 === 0) {
      setSpeed(prev => prev - 10);
    }
  }, [score]);

  return (
    <>
      <Toolbar
        gameStarted={gameStarted}
        topScore={data[0].score}
        score={score}
        onGameStart={onGameStart}
      />

      <div className='flex justify-center gap-8'>
        <div
          ref={ref}
          className='flex items-center justify-center focus:outline-none'
          onKeyDown={handleKeyPress}
          tabIndex={0}
          autoFocus
        >
          <div className='grid-cols-20 grid-rows-20 grid border border-black'>
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
              <div
                key={y}
                className='flex'
              >
                {Array.from({ length: GRID_SIZE }).map((_, x) => (
                  <div
                    key={x}
                    className={`h-5 w-5 border border-gray-200 
                ${
                  snake.some(segment => segment.x === x && segment.y === y) &&
                  'bg-green-500'
                }
                ${food.x === x && food.y === y && 'bg-red-500'}
                `}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Rating data={data} />
      </div>

      <Controls />

      <Dialog open={gameOver}>
        <DialogContent>
          <div className='flex items-center justify-between'>
            <h2 className='text-4xl font-bold text-red-600'>Game Over!!!</h2>
            <button onClick={() => setGameOver(false)}>
              <X />
            </button>
          </div>

          <p className='text-xl'>
            You finish with score <span className='font-bold'>{score}</span>{' '}
            points
          </p>
          <p className='text-xl'>
            If you want to save results - enter your name and push save button
          </p>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-2'>
              <input
                type='text'
                placeholder='Enter your name'
                className='w-full rounded-md border border-border p-2'
                onChange={e => setUsername(e.target.value)}
              />
              <Button
                className='w-full'
                onClick={onSaveResults}
                disabled={!username.trim()}
              >
                Save
              </Button>
            </div>

            <Button
              onClick={() => onGameStart()}
              className=' self-end'
            >
              Play Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
