// src/screens/StopDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as Speech from 'expo-speech';
import { stopService } from '../services/supabase';
import { colors, spacing, typography } from '../constants/theme';
import { Stop } from '../types';

interface StopDetailScreenProps {
    navigation: any;
    route: {
        params: {
            stopId: string;
            tourId: string;
        };
    };
}

export const StopDetailScreen: React.FC<StopDetailScreenProps> = ({ navigation, route }) => {
    const { stopId, tourId } = route.params;
    const [stop, setStop] = useState<Stop | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        loadStop();
        return () => {
            stopSpeech();
        };
    }, [stopId]);

    const loadStop = async () => {
        try {
            setLoading(true);
            const { data, error } = await stopService.getStopById(stopId);
            if (error) throw error;
            setStop(data);
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo cargar la parada');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const startSpeech = async () => {
        if (!stop) return;

        try {
            setIsSpeaking(true);
            const textToSpeak = `${stop.title}. ${stop.description}`;

            await Speech.speak(textToSpeak, {
                language: 'es',
                pitch: 1.0,
                rate: 1.0,
                onDone: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo reproducir el audio');
            setIsSpeaking(false);
        }
    };

    const pauseSpeech = async () => {
        try {
            await Speech.pause();
            setIsSpeaking(false);
        } catch (error) {
            Alert.alert('Error', 'No se pudo pausar el audio');
        }
    };

    const stopSpeech = async () => {
        try {
            await Speech.stop();
            setIsSpeaking(false);
        } catch (error) {
            console.error('Error stopping speech:', error);
        }
    };

    const resumeSpeech = async () => {
        try {
            setIsSpeaking(true);
            const textToSpeak = `${stop?.title}. ${stop?.description}`;

            await Speech.speak(textToSpeak, {
                language: 'es',
                pitch: 1.0,
                rate: 1.0,
                onDone: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo reanudar el audio');
            setIsSpeaking(false);
        }
    };

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.background,
                }}
            >
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!stop) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background }} />
        );
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }}
        >
            <View style={{ marginBottom: spacing.lg }}>
                <View
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: colors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: spacing.md,
                    }}
                >
                    <Text style={{ ...typography.h1, color: colors.background }}>
                        📍
                    </Text>
                </View>
            </View>

            <Text style={{ ...typography.h1, color: colors.text, marginBottom: spacing.md }}>
                {stop.title}
            </Text>

            <View
                style={{
                    backgroundColor: colors.surface,
                    padding: spacing.md,
                    borderRadius: 8,
                    marginBottom: spacing.lg,
                }}
            >
                <Text style={{ ...typography.caption, color: colors.textLight, marginBottom: spacing.sm }}>
                    Ubicación
                </Text>
                <Text style={{ ...typography.body, color: colors.text }}>
                    📍 {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                </Text>
            </View>

            <View style={{ marginBottom: spacing.lg }}>
                <Text style={{ ...typography.h3, color: colors.text, marginBottom: spacing.md }}>
                    Descripción
                </Text>
                <Text style={{ ...typography.body, color: colors.textLight, lineHeight: 24 }}>
                    {stop.description}
                </Text>
            </View>

            <View
                style={{
                    backgroundColor: colors.surface,
                    padding: spacing.lg,
                    borderRadius: 8,
                    marginBottom: spacing.lg,
                }}
            >
                <Text style={{ ...typography.h4, color: colors.text, marginBottom: spacing.md }}>
                    🔊 Reproducción de Audio
                </Text>

                <View style={{ flexDirection: 'row', gap: spacing.md, justifyContent: 'center' }}>
                    {!isSpeaking ? (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: colors.primary,
                                paddingVertical: spacing.md,
                                borderRadius: 8,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: spacing.sm,
                            }}
                            onPress={startSpeech}
                        >
                            <Text style={{ ...typography.button, color: colors.background }}>
                                ▶️ Reproducir
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.warning,
                                    paddingVertical: spacing.md,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                                onPress={pauseSpeech}
                            >
                                <Text style={{ ...typography.button, color: colors.background }}>
                                    ⏸️ Pausar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.error,
                                    paddingVertical: spacing.md,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                                onPress={stopSpeech}
                            >
                                <Text style={{ ...typography.button, color: colors.background }}>
                                    ⏹️ Detener
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <Text
                    style={{
                        ...typography.caption,
                        color: colors.textLight,
                        textAlign: 'center',
                        marginTop: spacing.md,
                    }}
                >
                    {isSpeaking ? '🎵 Reproduciéndose...' : 'Toca para escuchar la descripción'}
                </Text>
            </View>

            <View style={{ gap: spacing.md }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.primary,
                        paddingVertical: spacing.md,
                        borderRadius: 8,
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('StopForm', { tourId, stopId })}
                >
                    <Text style={{ ...typography.button, color: colors.background }}>
                        ✏️ Editar Parada
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: colors.accent,
                        paddingVertical: spacing.md,
                        borderRadius: 8,
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('Map', { tourId })}
                >
                    <Text style={{ ...typography.button, color: colors.background }}>
                        📍 Ver en Mapa
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        paddingVertical: spacing.md,
                        borderRadius: 8,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.primary,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={{ ...typography.button, color: colors.primary }}>
                        Volver
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};