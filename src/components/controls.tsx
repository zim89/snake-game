import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp
} from 'lucide-react';

export default function Controls() {
  return (
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
  );
}
