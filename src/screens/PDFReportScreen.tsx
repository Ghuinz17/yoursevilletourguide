// src/screens/PDFReportScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system'; // Necesario para manejo de archivos
import { tourService, stopService } from '../services/supabase';
import { colors, spacing, typography, shadows } from '../constants/theme';
import { Tour, Stop } from '../types';

export const PDFReportScreen = ({ navigation, route }: any) => {
    const { tourId } = route.params;
    const [tour, setTour] = useState<Tour | null>(null);
    const [stops, setStops] = useState<Stop[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => { loadData(); }, [tourId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tourData, stopsData] = await Promise.all([
                tourService.getTourById(tourId),
                stopService.getStopsByTour(tourId)
            ]);
            setTour(tourData.data);
            setStops(stopsData.data || []);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async () => {
        if (!tour) return;
        try {
            setGenerating(true);
            const htmlContent = `
                <html>
                    <body style="font-family: sans-serif; padding: 40px;">
                        <h1 style="color: ${colors.primary};">${tour.title}</h1>
                        <p><strong>Ciudad:</strong> ${tour.city}</p>
                        <p>${tour.description}</p>
                        <hr/>
                        <h2>Paradas</h2>
                        ${stops.map((s, i) => `
                            <div>
                                <h3>${i + 1}. ${s.title}</h3>
                                <p>${s.description}</p>
                            </div>
                        `).join('')}
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Esto permite que el usuario lo guarde o lo envíe
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            } else {
                Alert.alert('Error', 'La opción de compartir no está disponible');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo generar el PDF');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={typography.h2}>Generar Reporte</Text>
            <View style={[styles.infoCard, shadows.medium]}>
                <Text style={typography.h3}>{tour?.title}</Text>
                <Text style={typography.body}>El archivo incluirá descripción y paradas.</Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={generatePDF} disabled={generating}>
                {generating ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Descargar / Compartir PDF</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: spacing.lg, backgroundColor: colors.background, flexGrow: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    infoCard: { backgroundColor: 'white', padding: spacing.md, borderRadius: 10, marginVertical: spacing.xl },
    btn: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: 8, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' }
});