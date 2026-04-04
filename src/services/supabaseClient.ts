import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) console.error('Profile fetch error:', error);
  return data;
};

export const updateProfile = async (updates: any) => {
  const user = await getCurrentUser();
  if (!user) return { error: new Error('No user') };
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);
  return { error };
};

// Add coins (used only on first completion)
export const addCoins = async (amount: number) => {
  const user = await getCurrentUser();
  if (!user) return { error: new Error('No user') };
  const profile = await getProfile();
  const newCoins = (profile?.coins || 0) + amount;
  const { error } = await supabase
    .from('profiles')
    .update({ coins: newCoins })
    .eq('id', user.id);
  return { error };
};

// NEW: Check if this puzzle hash has already been completed
export const isFirstCompletion = async (puzzleHash: string): Promise<boolean> => {
  const profile = await getProfile();
  if (!profile) return true;
  const completed = profile.completed_single_puzzles || [];
  return !completed.includes(puzzleHash);
};

// NEW: Mark puzzle as completed (append hash)
export const markPuzzleCompleted = async (puzzleHash: string) => {
  const profile = await getProfile();
  if (!profile) return { error: new Error('No profile') };
  const completed = profile.completed_single_puzzles || [];
  if (completed.includes(puzzleHash)) return { error: null };
  completed.push(puzzleHash);
  const { error } = await supabase
    .from('profiles')
    .update({ completed_single_puzzles: completed })
    .eq('id', profile.id);
  return { error };
};

// Improved realtime subscription
export const subscribeToProfile = (callback: (profile: any) => void) => {
  let channel: any = null;

  getCurrentUser().then(user => {
    if (!user) return;
    channel = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  });

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  };
};

// Auth helpers (unchanged)
export const signUpWithEmailAndUsername = async (email: string, password: string, username: string) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email, password, options: { emailRedirectTo: window.location.origin }
  });
  if (authError) return { error: authError };

  if (authData.user) {
    await supabase.from('profiles').update({ username }).eq('id', authData.user.id);
  }
  return { data: authData, error: authError };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  return error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return error;
};