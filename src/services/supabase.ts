import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base64-arraybuffer';

const SUPABASE_URL = 'https://sqqobedceojzfycdyuru.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcW9iZWRjZW9qemZ5Y2R5dXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NTA2MTUsImV4cCI6MjA4MTQyNjYxNX0.ot2VE_ToRZFRRDoKBy1XMLOAMTBHf1FwPRmuJ3VwFRA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Tipos basados en estructura real de Supabase
export interface Tour {
    id: string;
    title: string;
    description: string;
    city: string;
    language: string;
    imagenes?: string;
    duration: number;
    created_by: string;
    created_at: string;
    price: number;
}

export interface Stop {
    id: string;
    tour_id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    stop_order: number;
    created_at: string;
}

export interface TourImagen {
    id: string;
    idtour: string;
    imagen: string;
}

export interface Profile {
    id: string;
    username: string;
    profile_image?: string;
    created_at: string;
}

export interface AuthUser {
    id: string;
    email: string;
    user_metadata?: {
        name?: string;
        avatar_url?: string;
    };
}

// Servicios de Autenticación
export const authService = {
    signUp: async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });
        return { data, error };
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    resetPassword: async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        return { data, error };
    },
};

// Servicios de Tours
export const tourService = {
    getAllTours: async () => {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .order('created_at', { ascending: false });
        return { data: data as Tour[], error };
    },

    getTourById: async (tourId: string) => {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .eq('id', tourId)
            .single();
        return { data: data as Tour, error };
    },

    createTour: async (tour: Omit<Tour, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('tours')
            .insert([tour])
            .select()
            .single();
        return { data: data as Tour, error };
    },

    updateTour: async (tourId: string, updates: Partial<Tour>) => {
        const { data, error } = await supabase
            .from('tours')
            .update(updates)
            .eq('id', tourId)
            .select()
            .single();
        return { data: data as Tour, error };
    },

    deleteTour: async (tourId: string) => {
        const { error } = await supabase
            .from('tours')
            .delete()
            .eq('id', tourId);
        return { error };
    },

    getToursByCity: async (city: string) => {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .eq('city', city)
            .order('created_at', { ascending: false });
        return { data: data as Tour[], error };
    },
};

// Servicios de Stops
export const stopService = {
    getStopsByTour: async (tourId: string) => {
        const { data, error } = await supabase
            .from('stops')
            .select('*')
            .eq('tour_id', tourId)
            .order('stop_order', { ascending: true });
        return { data: data as Stop[], error };
    },

    getStopById: async (stopId: string) => {
        const { data, error } = await supabase
            .from('stops')
            .select('*')
            .eq('id', stopId)
            .single();
        return { data: data as Stop, error };
    },

    createStop: async (stop: Omit<Stop, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('stops')
            .insert([stop])
            .select()
            .single();
        return { data: data as Stop, error };
    },

    updateStop: async (stopId: string, updates: Partial<Stop>) => {
        const { data, error } = await supabase
            .from('stops')
            .update(updates)
            .eq('id', stopId)
            .select()
            .single();
        return { data: data as Stop, error };
    },

    deleteStop: async (stopId: string) => {
        const { error } = await supabase
            .from('stops')
            .delete()
            .eq('id', stopId);
        return { error };
    },
};

// Servicios de Imágenes
export const imageService = {
    async uploadBase64(fileName: string, base64: string) {
        const base64Clean = base64.includes('base64,') ? base64.split('base64,')[1] : base64;
        const path = `tours/${Date.now()}_${fileName}.png`;

        const { data, error } = await supabase.storage
            .from('tour_assets')
            .upload(path, decode(base64Clean), { contentType: 'image/png' });

        if (error) throw error;
        const { data: urlData } = supabase.storage.from('tour_assets').getPublicUrl(path);
        return urlData.publicUrl;
    }
};

// Servicios de Tour Imágenes
export const tourImagenService = {
    getImagesByTour: async (tourId: string) => {
        const { data, error } = await supabase
            .from('tour_imagenes')
            .select('*')
            .eq('idtour', tourId);
        return { data: data as TourImagen[], error };
    },

    addImage: async (tourId: string, imagenUrl: string) => {
        const { data, error } = await supabase
            .from('tour_imagenes')
            .insert([{ idtour: tourId, imagen: imagenUrl }])
            .select()
            .single();
        return { data: data as TourImagen, error };
    },

    deleteImage: async (imagenId: string) => {
        const { error } = await supabase
            .from('tour_imagenes')
            .delete()
            .eq('id', imagenId);
        return { error };
    },
};

// Servicios de Profiles
export const profileService = {
    getProfile: async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        return { data: data as Profile, error };
    },

    updateProfile: async (userId: string, updates: Partial<Profile>) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        return { data: data as Profile, error };
    },

    createProfile: async (profile: Omit<Profile, 'created_at'>) => {
        const { data, error } = await supabase
            .from('profiles')
            .insert([profile])
            .select()
            .single();
        return { data: data as Profile, error };
    },
};