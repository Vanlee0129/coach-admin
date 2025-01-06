import supabase from '@/utils/supabase';

export async function login(params: { username: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.username,
    password: params.password,
  });

  if (error) {
    return {
      error,
      success: false,
    };
  }

  return {
    data,
    success: true,
  };
}
