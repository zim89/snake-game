import { Button } from './ui/button';

export const Toolbar = ({
  gameStarted,
  topScore,
  score,
  onGameStart
}: {
  gameStarted: boolean;
  topScore: number;
  score: number;
  onGameStart: () => void;
}) => {
  return (
    <>
      {gameStarted ? (
        <ul className='flex justify-center gap-2'>
          <li className='flex'>
            <span className=' rounded-l-full bg-gray-900 px-3 py-1 font-medium text-white'>
              Top Score:
            </span>
            <span className='min-w-12 rounded-r-full bg-gray-200 px-4 py-1 text-center font-bold text-green-600'>
              {topScore}
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
    </>
  );
};
