import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // The combined user auth + profile data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If Supabase isn't configured, we manage auth in-memory for preview purposes.
        if (!isSupabaseConfigured()) {
            const savedUser = localStorage.getItem('mockSessionActive');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await fetchProfile(session.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    await fetchProfile(session.user);
                } else {
                    setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (authUser) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            // Defaulting if profile creation failed/delayed
            setUser({ ...authUser, role: 'student' });
        } else {
            setUser({ ...authUser, ...data });
        }
    };

    const login = async (email, password) => {
        if (!isSupabaseConfigured()) {
            // For mock login, we now strictly check against registered mock users in localStorage array
            const registeredUsersStr = localStorage.getItem('mockRegisteredUsers');
            let registeredUsers = [];
            
            if (registeredUsersStr) {
                 registeredUsers = JSON.parse(registeredUsersStr);
            }
            
            const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

            if (foundUser) {
                // Do not expose password in session state
                const { password: _, ...sessionProfile } = foundUser;
                setUser(sessionProfile);
                localStorage.setItem('mockSessionActive', JSON.stringify(sessionProfile));
                return { error: null };
            } else {
                // Return an error mimicking Supabase format so forms can display it
                return { error: { message: "Invalid login credentials. Please register first." } };
            }
        }
        
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const logout = async () => {
        if (!isSupabaseConfigured()) {
            setUser(null);
            localStorage.removeItem('mockSessionActive');
            return { error: null };
        }
        return await supabase.auth.signOut();
    };

    // Note: Mock signup for preview purposes 
    const signup = async (email, password, profileData) => {
        if (!isSupabaseConfigured()) {
            const mockProfile = { id: Date.now().toString(), email, password, ...profileData };
            
            // Add to the list of known registered mock users
            const registeredUsersStr = localStorage.getItem('mockRegisteredUsers');
            let registeredUsers = [];
            if (registeredUsersStr) {
                registeredUsers = JSON.parse(registeredUsersStr);
            }

            // Check if email already exists in mock DB
            if (registeredUsers.some(u => u.email === email)) {
                return { data: null, error: { message: "User already registered" } };
            }

            registeredUsers.push(mockProfile);
            localStorage.setItem('mockRegisteredUsers', JSON.stringify(registeredUsers));

            // Automatically log them in (with password removed from active session)
            const { password: _, ...sessionProfile } = mockProfile;
            setUser(sessionProfile);
            localStorage.setItem('mockSessionActive', JSON.stringify(sessionProfile));

            return { data: sessionProfile, error: null };
        }

        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { data, error };

        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert([
                { id: data.user.id, ...profileData }
            ]);
            if (profileError) return { data: null, error: profileError };
            
            await fetchProfile(data.user);
        }
        
        return { data, error: null };
    };

    const value = {
        user,
        loading,
        login,
        logout,
        signup,
        isSupabaseConfigured: isSupabaseConfigured()
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
