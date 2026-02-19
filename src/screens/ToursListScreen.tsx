import React, { useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, RefreshControl,
    ActivityIndicator, Alert, Image, StyleSheet
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { tourService } from '../services/tourService';
import { colors, spacing, typography, shadows } from '../constants/theme';
import { Tour } from '../services/supabase';

export const ToursListScreen = ({ navigation }: any) => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadTours = async () => {
        try {
            setLoading(true);
            const { data, error } = await tourService.getAllTours();
            if (error) throw error;
            setTours(data || []);
        } catch (error: any) {
            Alert.alert('Error', 'No se pudieron cargar los tours');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(useCallback(() => { loadTours(); }, []));

    const handleDeleteTour = (tourId: string, tourTitle: string) => {
        Alert.alert(
            'Eliminar Tour',
            `¿Estás seguro de que quieres eliminar "${tourTitle}"? Esta acción no se puede deshacer.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await tourService.eliminar(tourId);
                            Alert.alert('Éxito', 'Tour eliminado correctamente');
                            loadTours();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el tour');
                        }
                    }
                }
            ]
        );
    };

    const renderTourCard = ({ item }: { item: Tour }) => (
        <TouchableOpacity
            style={[styles.card, shadows.medium]}
            onPress={() => navigation.navigate('TourDetail', { tourId: item.id })}
        >
            {item.imagenes ? (
                <Image source={{ uri: item.imagenes }} style={styles.cardImage} />
            ) : (
                <View style={[styles.cardImage, styles.placeholder]}>
                    <Ionicons name="image-outline" size={40} color={colors.textLight} />
                </View>
            )}

            <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                    <Text style={[typography.h3, { flex: 1 }]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <TouchableOpacity
                        onPress={() => handleDeleteTour(item.id, item.title)}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.price}>{item.price} € • {item.duration} min</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tours}
                renderItem={renderTourCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTours} />}
                ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay tours todavía</Text> : null}
            />
            <TouchableOpacity
                style={[styles.fab, shadows.large]}
                onPress={() => navigation.navigate('TourForm')}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    list: { padding: spacing.md },
    card: { backgroundColor: 'white', borderRadius: 12, marginBottom: 15, overflow: 'hidden' },
    cardImage: { width: '100%', height: 150 },
    placeholder: { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
    cardContent: { padding: 12 },
    cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    deleteButton: { padding: 5 },
    price: { color: colors.primary, marginTop: 5 },
    empty: { textAlign: 'center', marginTop: 50, color: colors.textLight },
    fab: {
        position: 'absolute', right: 20, bottom: 20,
        backgroundColor: colors.primary, width: 56, height: 56,
        borderRadius: 28, justifyContent: 'center', alignItems: 'center'
    }
});