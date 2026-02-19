// Tipos del auth

export interface AuthUser {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
}

export interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<any>;
    clearError: () => void;
    updateUser: (updatedUser: Partial<AuthUser>) => void;
    bootstrapAsync: () => Promise<void>;
}

// Tipos de tour

export interface Tour {
    id: string;
    title: string;
    description: string;
    city: string;
    language: string;
    duration: number;
    price: number;
    created_by: string;
    created_at: string;
    imagenes?: string;
}

export interface Stop {
    id: string;
    tour_id: string;
    title: string;
    description: string;
    latitude: number; 
    longitude: number;
    stop_order: number;
}

export interface TourImagen {
    id: string;
    idtour: string;
    imagen: string;
}

// Tipo profile

export interface Profile {
    id: string;
    username: string;
    profile_image?: string;
    created_at: string;
}

// Chat tipos

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface RasaResponse {
    recipient_id: string;
    text: string;
    buttons?: Array<{
        title: string;
        payload: string;
    }>;
}

// Tipos de navegación 

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ToursTab: undefined;
    TourDetail: { tourId: string };
    TourForm: { tourId?: string };
    EditTour: { tourId: string };
    
    StopForm: { tourId: string; stopId?: string };
    StopDetail: { stopId: string; tourId: string };
    EditStop: { stopId: string; tourId: string };
    
    Map: { tourId: string };
    PDFReport: { tourId: string };
    ChatTab: undefined;
    ProfileTab: undefined;
};

export type ToursStackParamList = {
    ToursList: undefined;
    TourDetail: { tourId: string };
    TourForm: { tourId?: string };
    EditTour: { tourId: string };
    
    StopForm: { tourId: string; stopId?: string };
    StopDetail: { stopId: string; tourId: string };
    EditStop: { stopId: string; tourId: string };
    
    Map: { tourId: string };
    PDFReport: { tourId: string };
};

export type ChatStackParamList = {
    ChatScreen: undefined;
};

export type ProfileStackParamList = {
    ProfileScreen: undefined;
};

export type TabParamList = {
    ToursListTab: undefined;
    ChatTab: undefined;
    ProfileTab: undefined;
};