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
import { tourService } from '../services/supabase';
import { colors, spacing, typography } from '../constants/theme';
import { Tour } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { TourImagePicker } from '../components/TourImagePicker';

type Props = NativeStackScreenProps<RootStackParamList, 'EditTour'>;

export const EditTourScreen: React.FC<Props> = ({ navigation, route }) => {
    const { tourId } = route.params;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [language, setLanguage] = useState('Español');
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        loadTour();
    }, [tourId]);

    const loadTour = async () => {
        try {
            const { data, error } = await tourService.getTourById(tourId);
            if (error) throw error;
            if (data) {
                setTitle(data.title);
                setDescription(data.description);
                setCity(data.city);
                setPrice(data.price.toString());
                setDuration(data.duration.toString());
                setLanguage(data.language);
                if (data.imagenes) {
                    setImages([data.imagenes]);
                }
            }
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo cargar el tour');
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
        if (!city.trim()) {
            Alert.alert('Error', 'La ciudad es requerida');
            return false;
        }
        if (!price.trim() || isNaN(parseFloat(price))) {
            Alert.alert('Error', 'Un precio válido es requerido');
            return false;
        }
        if (!duration.trim() || isNaN(parseInt(duration))) {
            Alert.alert('Error', 'Una duración válida es requerida');
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
                city,
                price: parseFloat(price),
                duration: parseInt(duration),
                language,
                imagenes: images[0] || '',
            };

            const { error } = await tourService.updateTour(tourId, updates);
            if (error) throw error;

            Alert.alert('Éxito', 'Tour actualizado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al actualizar el tour');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar Tour',
            '¿Estás seguro de que deseas eliminar este tour? Esta acción no se puede deshacer.',
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
            const { error } = await tourService.deleteTour(tourId);
            if (error) throw error;

            Alert.alert('Éxito', 'Tour eliminado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al eliminar el tour');
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
                    Editar Tour
                </Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Título *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Triana histórica"
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
                        placeholder="Describe el tour..."
                        placeholderTextColor={colors.textLight}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        editable={!submitting}
                    />
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.columnHalf}>
                        <Text style={styles.label}>Ciudad *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Sevilla"
                            placeholderTextColor={colors.textLight}
                            value={city}
                            onChangeText={setCity}
                            editable={!submitting}
                        />
                    </View>
                    <View style={styles.columnHalf}>
                        <Text style={styles.label}>Idioma</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Español"
                            placeholderTextColor={colors.textLight}
                            value={language}
                            onChangeText={setLanguage}
                            editable={!submitting}
                        />
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.columnHalf}>
                        <Text style={styles.label}>Precio (€) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={colors.textLight}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="decimal-pad"
                            editable={!submitting}
                        />
                    </View>
                    <View style={styles.columnHalf}>
                        <Text style={styles.label}>Duración (min) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            placeholderTextColor={colors.textLight}
                            value={duration}
                            onChangeText={setDuration}
                            keyboardType="number-pad"
                            editable={!submitting}
                        />
                    </View>
                </View>

                <TourImagePicker onImagesChange={(urls) => setImages(urls)} />

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
                        Eliminar Tour
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