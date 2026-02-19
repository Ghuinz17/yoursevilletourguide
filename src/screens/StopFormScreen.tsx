import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { stopService } from '../services/supabase';
import { colors, spacing, typography } from '../constants/theme';
import { Stop } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

interface StopFormScreenProps {
    navigation: any;
    route: {
        params: {
            tourId: string;
            stopId?: string;
        };
    };
}
type Props = NativeStackScreenProps<RootStackParamList, 'StopForm'>;

export const StopFormScreen: React.FC<Props> = ({ navigation, route }) => {
    const { tourId, stopId } = route.params;
    const [loading, setLoading] = useState(stopId ? true : false);
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [stopOrder, setStopOrder] = useState('');

    useEffect(() => {
        if (stopId) {
            loadStop();
        }
    }, [stopId]);

    const loadStop = async () => {
        try {
            const { data, error } = await stopService.getStopById(stopId!);
            if (error) throw error;
            if (data) {
                setTitle(data.title);
                setDescription(data.description);
                setLatitude(data.latitude.toString());
                setLongitude(data.longitude.toString());
                setStopOrder(data.stop_order.toString());
            }
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo cargar la parada');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'El título es requerido');
            return false;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'La descripción es requerida');
            return false;
        }
        if (!latitude.trim() || isNaN(parseFloat(latitude))) {
            Alert.alert('Error', 'Latitud válida requerida');
            return false;
        }
        if (!longitude.trim() || isNaN(parseFloat(longitude))) {
            Alert.alert('Error', 'Longitud válida requerida');
            return false;
        }
        if (!stopOrder.trim() || isNaN(parseInt(stopOrder))) {
            Alert.alert('Error', 'Orden válida requerida');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);

            if (stopId) {
                // Actualizar parada existente
                const { error } = await stopService.updateStop(stopId, {
                    title,
                    description,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    stop_order: parseInt(stopOrder),
                });
                if (error) throw error;
                Alert.alert('Éxito', 'Parada actualizada correctamente');
            } else {
                // Crear nueva parada
                const { error } = await stopService.createStop({
                    tour_id: tourId,
                    title,
                    description,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    stop_order: parseInt(stopOrder),
                });
                if (error) throw error;
                Alert.alert('Éxito', 'Parada creada correctamente');
            }

            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al guardar la parada');
        } finally {
            setSubmitting(false);
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.background }}
                contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }}
            >
                <Text style={{ ...typography.h2, color: colors.text, marginBottom: spacing.lg }}>
                    {stopId ? 'Editar Parada' : 'Nueva Parada'}
                </Text>

                <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ ...typography.h4, color: colors.text, marginBottom: spacing.sm }}>
                        Título
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 8,
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.md,
                            fontSize: 16,
                            color: colors.text,
                        }}
                        placeholder="Ej: Catedral de Sevilla"
                        placeholderTextColor={colors.textLight}
                        value={title}
                        onChangeText={setTitle}
                        editable={!submitting}
                    />
                </View>

                <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ ...typography.h4, color: colors.text, marginBottom: spacing.sm }}>
                        Descripción
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 8,
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.md,
                            fontSize: 16,
                            color: colors.text,
                            minHeight: 100,
                        }}
                        placeholder="Describe esta parada..."
                        placeholderTextColor={colors.textLight}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        editable={!submitting}
                    />
                </View>

                <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ ...typography.h4, color: colors.text, marginBottom: spacing.sm }}>
                        Latitud
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 8,
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.md,
                            fontSize: 16,
                            color: colors.text,
                        }}
                        placeholder="Ej: 37.3886"
                        placeholderTextColor={colors.textLight}
                        value={latitude}
                        onChangeText={setLatitude}
                        keyboardType="decimal-pad"
                        editable={!submitting}
                    />
                </View>

                <View style={{ marginBottom: spacing.lg }}>
                    <Text style={{ ...typography.h4, color: colors.text, marginBottom: spacing.sm }}>
                        Longitud
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 8,
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.md,
                            fontSize: 16,
                            color: colors.text,
                        }}
                        placeholder="Ej: -5.9823"
                        placeholderTextColor={colors.textLight}
                        value={longitude}
                        onChangeText={setLongitude}
                        keyboardType="decimal-pad"
                        editable={!submitting}
                    />
                </View>

                <View style={{ marginBottom: spacing.xl }}>
                    <Text style={{ ...typography.h4, color: colors.text, marginBottom: spacing.sm }}>
                        Orden de Parada
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 8,
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.md,
                            fontSize: 16,
                            color: colors.text,
                        }}
                        placeholder="Ej: 1"
                        placeholderTextColor={colors.textLight}
                        value={stopOrder}
                        onChangeText={setStopOrder}
                        keyboardType="number-pad"
                        editable={!submitting}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={{
                        backgroundColor: colors.primary,
                        paddingVertical: spacing.md,
                        borderRadius: 8,
                        alignItems: 'center',
                        opacity: submitting ? 0.6 : 1,
                    }}
                >
                    {submitting ? (
                        <ActivityIndicator color={colors.background} size="small" />
                    ) : (
                        <Text style={{ ...typography.button, color: colors.background }}>
                            {stopId ? 'Guardar Cambios' : 'Crear Parada'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    disabled={submitting}
                    style={{
                        marginTop: spacing.md,
                        paddingVertical: spacing.md,
                        borderRadius: 8,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.primary,
                    }}
                >
                    <Text style={{ ...typography.button, color: colors.primary }}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};