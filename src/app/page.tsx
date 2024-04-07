import Snake from '@/components/snake';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase
    .from('score')
    .select()
    .order('score', { ascending: false })
    .limit(10);

  return (
    <div className='h-full'>
      <div className='space-y-5 py-6 text-center'>
        <h1 className='text-center text-2xl font-bold'>SNAKE GAME</h1>

        <Snake data={data ?? []} />
      </div>
    </div>
  );
}
