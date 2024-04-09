import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const getPlayerByName = async (username: string) => {
  const { data, error } = await supabase
    .from('score')
    .select()
    .eq('username', username.trim());

  if (data) {
    return data.length > 0 ? data[0] : null;
  }
};

export const createPlayer = async (username: string, score: number) => {
  const { error } = await supabase
    .from('score')
    .insert({ username: username.trim(), score });

  return error;
};
