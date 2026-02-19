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
    StyleSheet,
} from 'react-native';
import { stopService } from '../services/supabase';
import { colors, spacing, typography } from '../constants/theme';
import { Stop } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EditStop'>;

export const EditStopScreen: React.FC<Props> = ({ navigation, route }) => {
    const { stopId, tourId } = route.params;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [stopOrder, setStopOrder] = useState('');

    useEffect(() => {
        loadStop();
    }, [stopId]);

    const loadStop = async () => {
        try {
            const { data, error } = await stopService.getStopById(stopId);
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

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);

            const updates = {
                title,
                description,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                stop_order: parseInt(stopOrder),
            };

            const { error } = await stopService.updateStop(stopId, updates);
            if (error) throw error;

            Alert.alert('Éxito', 'Parada actualizada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al actualizar la parada');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar Parada',
            '¿Estás seguro de que deseas eliminar esta parada? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: deleteConfirmed,
                },
            ]
        );
    };

    const deleteConfirmed = async () => {
        try {
            setSubmitting(true);
            const { error } = await stopService.deleteStop(stopId);
            if (error) throw error;

            Alert.alert('Éxito', 'Parada eliminada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al eliminar la parada');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
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
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <Text style={[typography.h2, { color: colors.text, marginBottom: spacing.lg }]}>
                    Editar Parada
                </Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Título *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Catedral de Sevilla"
                        placeholderTextColor={colors.textLight}
                        value={title}
                        onChangeText={setTitle}
                        editable={!submitting}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Descripción *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe esta parada..."
                        placeholderTextColor={colors.textLight}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        editable={!submitting}
                    />
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.columnHalf}>
                        <Text style={styles.label}>Latitud *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 37.3886"
                            placeholderTextColor={colors.textLight}
                            value={latitude}
                            onChangeText={setLatitude}
                            keyboardType="decimal-pad"
                            editable={!submitting}
                        />
                    </View>
                    <View style={styles.columnHalf}>
                        <Text style={styles.label}>Longitud *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: -5.9823"
                            placeholderTextColor={colors.textLight}
                            value={longitude}
                            onChangeText={setLongitude}
                            keyboardType="decimal-pad"
                            editable={!submitting}
                        />
                    </View>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Orden de Parada *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 1"
                        placeholderTextColor={colors.textLight}
                        value={stopOrder}
                        onChangeText={setStopOrder}
                        keyboardType="number-pad"
                        editable={!submitting}
                    />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Ubicación Actual</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Lat:</Text>
                        <Text style={styles.infoValue}>{latitude || 'No especificada'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Lon:</Text>
                        <Text style={styles.infoValue}>{longitude || 'No especificada'}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleUpdate}
                    disabled={submitting}
                    style={[styles.button, styles.primaryButton, { opacity: submitting ? 0.6 : 1 }]}
                >
                    {submitting ? (
                        <ActivityIndicator color={colors.background} size="small" />
                    ) : (
                        <Text style={[typography.button, { color: colors.background }]}>
                            Guardar Cambios
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDelete}
                    disabled={submitting}
                    style={[styles.button, styles.dangerButton, { opacity: submitting ? 0.6 : 1 }]}
                >
                    <Text style={[typography.button, { color: '#fff' }]}>
                        Eliminar Parada
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    disabled={submitting}
                    style={styles.secondaryButton}
                >
                    <Text style={[typography.button, { color: colors.primary }]}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        paddingBottom: spacing.xl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    fieldContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: 16,
        color: colors.text,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    rowContainer: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        gap: spacing.md,
    },
    columnHalf: {
        flex: 1,
    },
    infoCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    infoTitle: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    infoLabel: {
        ...typography.body,
        color: colors.textLight,
        fontWeight: '500',
    },
    infoValue: {
        ...typography.body,
        color: colors.text,
        fontWeight: '600',
    },
    button: {
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    dangerButton: {
        backgroundColor: '#E74C3C',
    },
    secondaryButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
});