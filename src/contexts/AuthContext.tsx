import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }

    return data;
  };

  const createProfile = async (userId: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        balance: 100000,
        daily_pnl: 0,
        total_pnl: 0,
        win_rate: 0,
        rank: 0,
      });

    if (error) {
      console.error('Error creating profile:', error.message);
      return null;
    }

    return fetchProfile(userId);
  };

  const calculateWinRate = async (userId: string) => {
    const { data: trades, error } = await supabase
      .from('trades')
      .select('pnl')
      .eq('user_id', userId);

    if (error || !trades.length) return 0;

    const winningTrades = trades.filter(trade => trade.pnl > 0).length;
    return (winningTrades / trades.length) * 100;
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    // Calculate win rate
    const winRate = await calculateWinRate(user.id);
    
    // Update profile with new win rate
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ win_rate: winRate })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating win rate:', updateError);
    }

    // Fetch updated profile
    const profile = await fetchProfile(user.id);
    if (profile) {
      setProfile(profile);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(async (profile) => {
          if (!profile) {
            const newProfile = await createProfile(session.user.id);
            setProfile(newProfile);
          } else {
            setProfile(profile);
          }
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (!profile) {
          const newProfile = await createProfile(session.user.id);
          setProfile(newProfile);
        } else {
          setProfile(profile);
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      refreshProfile,
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}