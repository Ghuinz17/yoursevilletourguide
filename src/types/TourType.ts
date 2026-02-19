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