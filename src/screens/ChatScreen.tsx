// src/screens/ChatScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { colors, spacing, typography, shadows } from '../constants/theme';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const RASA_SERVER_URL = 'https://glorious-xylophone-69vrvjj67w6r2r549.github.dev/webhooks/rest/webhook';

// Fallback responses si Rasa no está disponible
const FALLBACK_RESPONSES: { [key: string]: string[] } = {
    tour: [
        '¿Te gustaría explorar algún tour específico de Sevilla?',
        'Tenemos tours de catedrales, alcázares, plazas y mucho más.',
    ],
    precio: [
        'Los precios varían según el tour. ¿Qué tipo de tour te interesa?',
        'Puedo mostrarte tours en diferentes rangos de precio.',
    ],
    horario: [
        'Los tours están disponibles en varios horarios. ¿Qué hora te va bien?',
        'Podemos organizar tours matutinos, vespertinos y nocturnos.',
    ],
    monumento: [
        'Sevilla tiene monumentos históricos increíbles. ¿Cuál te interesa visitar?',
        'La Catedral, el Alcázar y la Torre del Oro son muy populares.',
    ],
    ayuda: [
        'Puedo ayudarte con información sobre tours, monumentos, horarios y precios.',
        '¿Qué te gustaría saber?',
    ],
};

export const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: '¡Hola! Soy tu asistente de tours de Sevilla. ¿En qué puedo ayudarte?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    const getRandomResponse = (key: string): string => {
        const responses = FALLBACK_RESPONSES[key] || FALLBACK_RESPONSES.ayuda;
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setLoading(true);

        try {
            // Intentar conectar con Rasa
            const response = await axios.post(
                RASA_SERVER_URL,
                { sender: 'user', message: inputText },
                { timeout: 5000 }
            );

            const botResponses = response.data || [];

            if (botResponses.length > 0) {
                botResponses.forEach((response: any, index: number) => {
                    const botMessage: ChatMessage = {
                        id: Date.now().toString() + index,
                        text: response.text || 'Lo siento, no entendí bien.',
                        sender: 'bot',
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, botMessage]);
                });
            } else {
                // Fallback: usar respuestas predefinidas
                const lowerInput = inputText.toLowerCase();
                let key = 'ayuda';

                if (lowerInput.includes('tour')) key = 'tour';
                else if (lowerInput.includes('precio') || lowerInput.includes('costo')) key = 'precio';
                else if (lowerInput.includes('hora') || lowerInput.includes('horario')) key = 'horario';
                else if (
                    lowerInput.includes('monumento') ||
                    lowerInput.includes('catedral') ||
                    lowerInput.includes('alcázar')
                )
                    key = 'monumento';

                const botResponse: ChatMessage = {
                    id: Date.now().toString(),
                    text: getRandomResponse(key),
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botResponse]);
            }
        } catch (error) {
            // Si Rasa no responde, usar respuestas predeterminadas
            const lowerInput = inputText.toLowerCase();
            let key = 'ayuda';

            if (lowerInput.includes('tour')) key = 'tour';
            else if (lowerInput.includes('precio') || lowerInput.includes('costo')) key = 'precio';
            else if (lowerInput.includes('hora') || lowerInput.includes('horario')) key = 'horario';
            else if (
                lowerInput.includes('monumento') ||
                lowerInput.includes('catedral') ||
                lowerInput.includes('alcázar')
            )
                key = 'monumento';

            const botResponse: ChatMessage = {
                id: Date.now().toString(),
                text: getRandomResponse(key),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
        } finally {
            setLoading(false);
        }
    };

    const speakMessage = async (text: string) => {
        try {
            setIsSpeaking(true);
            await Speech.speak(text, {
                language: 'es',
                pitch: 1.0,
                rate: 1.0,
                onDone: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo reproducir el audio');
            setIsSpeaking(false);
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View
            style={{
                marginVertical: spacing.sm,
                marginHorizontal: spacing.md,
                alignItems: item.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
        >
            <TouchableOpacity
                onLongPress={() => speakMessage(item.text)}
                style={{
                    maxWidth: '85%',
                    backgroundColor: item.sender === 'user' ? colors.primary : colors.surface,
                    padding: spacing.md,
                    borderRadius: 12,
                    ...shadows.small,
                }}
            >
                <Text
                    style={{
                        ...typography.body,
                        color: item.sender === 'user' ? colors.background : colors.text,
                    }}
                >
                    {item.text}
                </Text>
                <Text
                    style={{
                        ...typography.caption,
                        color: item.sender === 'user' ? colors.background : colors.textLight,
                        marginTop: spacing.sm,
                        opacity: 0.7,
                    }}
                >
                    {item.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: colors.background }}
        >
            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: spacing.md }}
                onContentSizeChange={() => scrollToBottom()}
            />

            {/* Loading indicator */}
            {loading && (
                <View
                    style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        alignItems: 'flex-start',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: colors.surface,
                            padding: spacing.md,
                            borderRadius: 12,
                            flexDirection: 'row',
                            gap: spacing.sm,
                            alignItems: 'center',
                        }}
                    >
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={{ ...typography.body, color: colors.textLight }}>
                            Escribiendo...
                        </Text>
                    </View>
                </View>
            )}

            {/* Input Area */}
            <View
                style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,
                    backgroundColor: colors.background,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing.sm,
                        backgroundColor: colors.surface,
                        borderRadius: 24,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                    }}
                >
                    <TextInput
                        style={{
                            flex: 1,
                            paddingVertical: spacing.md,
                            fontSize: 16,
                            color: colors.text,
                        }}
                        placeholder="Escribe tu pregunta..."
                        placeholderTextColor={colors.textLight}
                        value={inputText}
                        onChangeText={setInputText}
                        editable={!loading}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={!inputText.trim() || loading}
                        style={{
                            backgroundColor: colors.primary,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: !inputText.trim() || loading ? 0.5 : 1,
                        }}
                    >
                        <Text style={{ fontSize: 18 }}>➤</Text>
                    </TouchableOpacity>
                </View>
                <Text
                    style={{
                        ...typography.caption,
                        color: colors.textLight,
                        marginTop: spacing.sm,
                        textAlign: 'center',
                    }}
                >
                    Mantén presionado un mensaje para escucharlo 🔊
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};