import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    Alert, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import { tourService } from '../services/tourService';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../constants/theme';
import { TourImagePicker } from '../components/TourImagePicker';

export const TourFormScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('Sevilla');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [images, setImages] = useState<string[]>([]);

    const handleSave = async () => {
        if (!user?.id) {
            Alert.alert('Error', 'Debes iniciar sesión');
            return;
        }

        if (!title || !description || !price) {
            Alert.alert('Error', 'Rellena los campos obligatorios');
            return;
        }

        try {
            setLoading(true);
            const newTour = {
                title,
                description,
                city,
                price: parseFloat(price),
                duration: parseInt(duration) || 0,
                language: 'Español',
                created_by: user.id, 
                imagenes: images[0] || '',
            };

            await tourService.crear(newTour);

            Alert.alert('¡Éxito!', 'Tour creado', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={typography.h2}>Nuevo Tour</Text>
                <View style={styles.form}>
                    <Text style={styles.label}>Título *</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Triana histórica" />

                    <Text style={styles.label}>Descripción *</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline placeholder="Descripción..." />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.label}>Precio (€)</Text>
                            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Minutos</Text>
                            <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" />
                        </View>
                    </View>

                    <TourImagePicker onImagesChange={(urls) => setImages(urls)} />

                    <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Publicar</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { padding: spacing.lg, backgroundColor: colors.background },
    form: { marginTop: spacing.md },
    label: { ...typography.body, fontWeight: 'bold', color: colors.text, marginBottom: 5 },
    input: { backgroundColor: 'white', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 15 },
    textArea: { height: 80, textAlignVertical: 'top' },
    row: { flexDirection: 'row' },
    btn: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { color: 'white', fontWeight: 'bold' }
});