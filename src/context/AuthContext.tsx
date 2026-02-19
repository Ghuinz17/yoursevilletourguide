import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/supabase';
import type { AuthContextType, AuthUser } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        bootstrapAsync();
    }, []);
    
    //Restarur sesión si existe
    const bootstrapAsync = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const currentUser = await authService.getCurrentUser();

            if (currentUser) {
                const newUser: AuthUser = {
                    id: currentUser.id,
                    email: currentUser.email ?? '',
                    name: currentUser.user_metadata?.name ?? undefined,
                    avatar_url: currentUser.user_metadata?.avatar_url ?? undefined,
                };
                setUser(newUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err: any) {
            console.error('Error checking user:', err);
            setError(err.message ?? 'Error al verificar usuario');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // Nuevo usuario
    const signUp = useCallback(
        async (email: string, password: string, name: string): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                if (!email || !password || !name) {
                    throw new Error('Email, contraseña y nombre son requeridos');
                }

                if (password.length < 6) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres');
                }

                const { data, error: signUpError } = await authService.signUp(email, password, name);

                if (signUpError) {
                    throw signUpError;
                }

                if (data.user) {
                    const newUser: AuthUser = {
                        id: data.user.id,
                        email: data.user.email ?? '',
                        name: name ?? undefined,
                        avatar_url: undefined,
                    };
                    setUser(newUser);
                    setIsAuthenticated(true);
                }
            } catch (err: any) {
                const errorMessage = err.message ?? 'Error al registrarse';
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

 
    //Inicio de sesión
    const signIn = useCallback(
        async (email: string, password: string): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                if (!email || !password) {
                    throw new Error('Email y contraseña son requeridos');
                }

                const { data, error: signInError } = await authService.signIn(email, password);

                if (signInError) {
                    throw signInError;
                }

                if (data.user) {
                    const newUser: AuthUser = {
                        id: data.user.id,
                        email: data.user.email ?? '',
                        name: data.user.user_metadata?.name ?? undefined,
                        avatar_url: data.user.user_metadata?.avatar_url ?? undefined,
                    };
                    setUser(newUser);
                    setIsAuthenticated(true);
                }
            } catch (err: any) {
                const errorMessage = err.message ?? 'Error al iniciar sesión';
                setError(errorMessage);
                setUser(null);
                setIsAuthenticated(false);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    //Cerrar sesión
    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { error: signOutError } = await authService.signOut();

            if (signOutError) {
                throw signOutError;
            }

            setUser(null);
            setIsAuthenticated(false);
        } catch (err: any) {
            const errorMessage = err.message ?? 'Error al cerrar sesión';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    //Restablecer contraseña
    const resetPassword = useCallback(async (email: string) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: resetError } = await authService.resetPassword(email);

            if (resetError) {
                throw resetError;
            }

            return data;
        } catch (err: any) {
            const errorMessage = err.message ?? 'Error al resetear contraseña';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const clearError = useCallback(() => {
        setError(null);
    }, []);

    //Actualizar usuario
    const updateUser = useCallback((updatedUser: Partial<AuthUser>) => {
        setUser((prevUser: AuthUser | null) => {
            if (!prevUser) return null;
            return { ...prevUser, ...updatedUser };
        });
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated,
        signUp,
        signIn,
        signOut,
        resetPassword,
        clearError,
        updateUser,
        bootstrapAsync,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export const useIsAuthenticated = (): boolean => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated;
};

export const useUser = (): AuthUser | null => {
    const { user } = useAuth();
    return user;
};

export const useAuthLoading = (): boolean => {
    const { loading } = useAuth();
    return loading;
};

export const useAuthError = (): [string | null, () => void] => {
    const { error, clearError } = useAuth();
    return [error, clearError];
};

export const useAuthMethods = () => {
    const { signUp, signIn, signOut, resetPassword } = useAuth();
    return { signUp, signIn, signOut, resetPassword };
};