import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { stopService } from '../services/supabase';
import { colors, spacing, typography } from '../constants/theme';
import { Stop } from '../types';

interface MapScreenProps {
    navigation: any;
    route: {
        params: {
            tourId: string;
        };
    };
}

export const MapScreen: React.FC<MapScreenProps> = ({ navigation, route }) => {
    const { tourId } = route.params;
    const [stops, setStops] = useState<Stop[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

    // Coordenadas de Sevilla
    const SEVILLE_CENTER = {
        latitude: 37.3886,
        longitude: -5.9823,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    useEffect(() => {
        loadStops();
    }, [tourId]);

    const loadStops = async () => {
        try {
            setLoading(true);
            const { data, error } = await stopService.getStopsByTour(tourId);
            if (error) throw error;
            setStops(data || []);
        } catch (error: any) {
            Alert.alert('Error', 'No se pudieron cargar las paradas');
            navigation.goBack();
        } finally {
            setLoading(false);
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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={SEVILLE_CENTER}
                showsUserLocation
                showsMyLocationButton
            >
                {stops.map((stop, index) => (
                    <Marker
                        key={stop.id}
                        coordinate={{
                            latitude: stop.latitude,
                            longitude: stop.longitude,
                        }}
                        pinColor={colors.primary}
                        onPress={() => setSelectedStop(stop)}
                    >
                        <View
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: colors.primary,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: colors.background,
                            }}
                        >
                            <Text style={{ ...typography.caption, color: colors.background, fontWeight: 'bold' }}>
                                {index + 1}
                            </Text>
                        </View>

                        <Callout
                            onPress={() => {
                                navigation.navigate('StopDetail', { stopId: stop.id, tourId });
                            }}
                        >
                            <View style={{ padding: spacing.md, backgroundColor: colors.background, borderRadius: 8 }}>
                                <Text style={{ ...typography.h4, color: colors.text }}>
                                    {stop.title}
                                </Text>
                                <Text
                                    style={{
                                        ...typography.body,
                                        color: colors.textLight,
                                        marginTop: spacing.sm,
                                    }}
                                    numberOfLines={2}
                                >
                                    {stop.description}
                                </Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {selectedStop && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: colors.background,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.lg,
                        maxHeight: '40%',
                    }}
                >
                    <ScrollView>
                        <TouchableOpacity
                            onPress={() => setSelectedStop(null)}
                            style={{
                                alignSelf: 'center',
                                width: 40,
                                height: 4,
                                backgroundColor: colors.border,
                                borderRadius: 2,
                                marginBottom: spacing.md,
                            }}
                        />

                        <Text style={{ ...typography.h3, color: colors.text, marginBottom: spacing.sm }}>
                            {selectedStop.title}
                        </Text>

                        <Text style={{ ...typography.body, color: colors.textLight, marginBottom: spacing.md }}>
                            {selectedStop.description}
                        </Text>

                        <View
                            style={{
                                backgroundColor: colors.surface,
                                padding: spacing.md,
                                borderRadius: 8,
                                marginBottom: spacing.md,
                            }}
                        >
                            <Text style={{ ...typography.caption, color: colors.textLight }}>
                                Coordenadas
                            </Text>
                            <Text style={{ ...typography.body, color: colors.text }}>
                                {selectedStop.latitude.toFixed(4)}, {selectedStop.longitude.toFixed(4)}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', gap: spacing.md }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.primary,
                                    paddingVertical: spacing.md,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    navigation.navigate('StopDetail', { stopId: selectedStop.id, tourId });
                                    setSelectedStop(null);
                                }}
                            >
                                <Text style={{ ...typography.button, color: colors.background }}>
                                    Ver Detalles
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.accent,
                                    paddingVertical: spacing.md,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    navigation.navigate('StopForm', { tourId, stopId: selectedStop.id });
                                    setSelectedStop(null);
                                }}
                            >
                                <Text style={{ ...typography.button, color: colors.background }}>
                                    Editar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
};