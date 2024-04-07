'use client';

import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { createClient } from '@/lib/supabase/client';

const GRID_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 2;
const INITIAL_DIRECTION: Direction = 'DOWN';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type Point = {
  x: number;
  y: number;
};

export interface IData {
  id: number;
  inserted_at: string;
  updated_at: string;
  username: string;
  score: number;
}

export default function Snake({ data }: { data: IData[] }) {
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
  const [speed, setSpeed] = useState<number>(150);
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
    setSpeed(150);
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
      {gameStarted ? (
        <ul className='flex justify-center gap-2'>
          <li className='flex'>
            <span className=' rounded-l-full bg-gray-900 px-3 py-1 font-medium text-white'>
              Top Score:
            </span>
            <span className='min-w-12 rounded-r-full bg-gray-200 px-4 py-1 text-center font-bold text-green-600'>
              {data[0].score}
            </span>
          </li>
          <li className='flex'>
            <span className=' rounded-l-full bg-gray-900 px-3 py-1 font-medium text-white'>
              Your Score:
            </span>
            <span className='min-w-12 rounded-r-full bg-gray-200 px-4 py-1 text-center font-bold text-blue-500'>
              {score}
            </span>
          </li>
        </ul>
      ) : (
        <Button
          onClick={onGameStart}
          className=' cursor-pointer'
        >
          Start Game
        </Button>
      )}

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

        <div className='space-y-3'>
          <h3 className='text-start text-base font-bold'>Top 10 rating:</h3>
          <ul className='w-80 rounded-lg border border-border'>
            {data.map(item => (
              <li
                key={item.id}
                className='flex justify-between border-b border-b-border px-4 py-2'
              >
                <span className='font-bold'>{item.username}</span>
                <span className=' text-blue-600'>{item.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='flex flex-col items-center gap-5'>
        <h2 className='text-2xl font-bold'>How to Play</h2>
        <h3>
          <span className='text-lg font-medium text-yellow-600'>Note: </span>
          press{' '}
          <span className='rounded-lg bg-slate-200 px-2 py-1'>
            <span>Space</span>
          </span>{' '}
          to pause the game
        </h3>
        <ul className='space-y-1'>
          <li className='flex items-center gap-2'>
            <span className='rounded-lg bg-slate-200 p-1'>
              <ArrowBigUp className='stroke-1' />
            </span>
            <span className='text-lg'>Move Up</span>
          </li>
          <li className='flex items-center gap-2'>
            <span className='rounded-lg bg-slate-200 p-1'>
              <ArrowBigDown className='stroke-1' />
            </span>
            <span className='text-lg'>Move Down</span>
          </li>
          <li className='flex items-center gap-2'>
            <span className='rounded-lg bg-slate-200 p-1'>
              <ArrowBigLeft className='stroke-1' />
            </span>
            <span className='text-lg'>Move Left</span>
          </li>
          <li className='flex items-center gap-2'>
            <span className='rounded-lg bg-slate-200 p-1'>
              <ArrowBigRight className='stroke-1' />
            </span>
            <span className='text-lg'>Move Right</span>
          </li>
        </ul>
      </div>

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
