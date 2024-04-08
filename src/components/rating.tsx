export const Rating = ({
  data
}: {
  data: {
    id: number;
    inserted_at: string;
    updated_at: string;
    username: string;
    score: number;
  }[];
}) => {
  return (
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
  );
};
