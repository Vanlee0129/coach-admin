import supabase from '@/utils/supabase';

export const queryOnlineUser = async () => {
  const { data: user, error } = await supabase
    .from('user')
    .select()
    .eq('status', 'online');

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    data: user,
    success: true,
  };
};

export const queryUser = async () => {
  const { data: user, error } = await supabase
    .from('user')
    .select()
    .order('id', { ascending: true });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    data: user,
    success: true,
  };
};

export const createUser = async (info: Record<string, string>) => {
  const { data, error } = await supabase.from('user').insert([info]);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    data,
    success: true,
  };
};

export const changeUserInfo = async (
  id: number,
  info: Record<string, string>,
) => {
  const { error } = await supabase.from('user').update(info).eq('id', id);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    success: true,
  };
};

export const uploadUserImage = async (uuid: string, file: File) => {
  const { data, error } = await supabase.storage
    .from('coach')
    .upload(`coach-${uuid}`, file);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    data,
    success: true,
  };
};

export const getUserImageUrl = async (key: string) => {
  try {
    const { data } = await supabase.storage
      .from('coach')
      .createSignedUrl(key, 60 * 60 * 24 * 7);
    return {
      data,
      success: true,
    };
  } catch (error) {
    return {
      error: error,
      success: false,
    };
  }
};
