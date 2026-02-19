import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Image,
	StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tourService, stopService } from '../services/supabase';
import { colors, spacing, typography, shadows } from '../constants/theme';
import { Tour, Stop } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'TourDetail'>;

export const TourDetailScreen: React.FC<Props> = ({ navigation, route }) => {
	const { tourId } = route.params;
	const [tour, setTour] = useState<Tour | null>(null);
	const [stops, setStops] = useState<Stop[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={() => navigation.navigate('TourForm', { tourId })}
					style={{ marginRight: spacing.sm }}
				>
					<Ionicons name="create-outline" size={24} color={colors.primary} />
				</TouchableOpacity>
			),
		});
	}, [navigation, tourId]);

	useEffect(() => {
		loadTourData();
	}, [tourId]);

	const loadTourData = async () => {
		try {
			setLoading(true);
			const [tourData, stopsData] = await Promise.all([
				tourService.getTourById(tourId),
				stopService.getStopsByTour(tourId),
			]);

			if (tourData.error) throw tourData.error;

			setTour(tourData.data);
			setStops(stopsData.data || []);
		} catch (error: any) {
			Alert.alert('Error', 'No se pudo cargar la información del tour');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteTour = async () => {
		Alert.alert(
			'Eliminar Tour',
			'¿Estás seguro de que quieres borrar este tour por completo? Esta acción no se puede deshacer.',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						try {
							const { error } = await tourService.deleteTour(tourId);
							if (error) throw error;
							navigation.goBack();
						} catch (error) {
							Alert.alert('Error', 'No se pudo eliminar el tour');
						}
					},
				},
			]
		);
	};

	const handleDeleteStop = async (stopId: string, title: string) => {
		Alert.alert(
			'Eliminar parada',
			`¿Borrar "${title}"?`,
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						try {
							const { error } = await stopService.deleteStop(stopId);
							if (error) throw error;
							setStops(stops.filter((s) => s.id !== stopId));
						} catch (error) {
							Alert.alert('Error', 'No se pudo eliminar la parada');
						}
					},
				},
			]
		);
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	if (!tour) return null;

	return (
		<ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
			{tour.imagenes ? (
				<Image source={{ uri: tour.imagenes }} style={styles.headerImage} />
			) : (
				<View style={[styles.headerImage, styles.placeholderImage]}>
					<Ionicons name="image-outline" size={60} color={colors.textLight} />
				</View>
			)}

			<View style={{ padding: spacing.lg }}>
				<View style={styles.titleRow}>
					<View style={{ flex: 1 }}>
						<Text style={typography.h1}>{tour.title}</Text>
						<Text style={{ ...typography.body, color: colors.textLight }}>
							{tour.city} • {tour.duration} min • {tour.price}€
						</Text>
					</View>
					<TouchableOpacity
						style={[styles.editBadge, shadows.small]}
						onPress={() => navigation.navigate('TourForm', { tourId })}
					>
						<Ionicons name="pencil" size={14} color="white" />
						<Text style={styles.editBadgeText}>Editar</Text>
					</TouchableOpacity>
				</View>

				<Text style={{ ...typography.h3, marginTop: spacing.lg }}>Descripción</Text>
				<Text style={{ ...typography.body, marginTop: spacing.xs, color: colors.text }}>
					{tour.description}
				</Text>

				<View style={styles.sectionHeader}>
					<Text style={typography.h2}>Paradas</Text>
					<TouchableOpacity
						onPress={() => navigation.navigate('StopForm', { tourId })}
						style={styles.addButton}
					>
						<Text style={styles.addButtonText}>+ Añadir Parada</Text>
					</TouchableOpacity>
				</View>

				<View style={{ marginTop: spacing.md }}>
					{stops.length === 0 ? (
						<Text style={styles.emptyText}>No hay paradas configuradas.</Text>
					) : (
						stops.sort((a, b) => a.stop_order - b.stop_order).map((stop, index) => (
							<View key={stop.id} style={[styles.stopCard, shadows.medium]}>
								<View style={styles.stopNumber}>
									<Text style={styles.stopNumberText}>{index + 1}</Text>
								</View>
								<View style={{ flex: 1, marginLeft: spacing.md }}>
									<Text style={typography.h3}>{stop.title}</Text>
									<View style={styles.stopActions}>
										<TouchableOpacity
											onPress={() => navigation.navigate('StopForm', { tourId, stopId: stop.id })}
										>
											<Text style={styles.actionLink}>Editar</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => handleDeleteStop(stop.id, stop.title)}
										>
											<Text style={[styles.actionLink, { color: colors.error }]}>Eliminar</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						))
					)}
				</View>

				<View style={styles.footer}>
					<TouchableOpacity
						style={[styles.mainButton, { backgroundColor: colors.primary }, shadows.small]}
						onPress={() => navigation.navigate('Map', { tourId })}
					>
						<Text style={styles.mainButtonText}>Ver en el Mapa</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.mainButton, { backgroundColor: colors.accent }, shadows.small]}
						onPress={() => navigation.navigate('PDFReport', { tourId })}
					>
						<Ionicons name="document-text-outline" size={20} color="white" style={{ marginRight: 8 }} />
						<Text style={styles.mainButtonText}>Descargar Reporte PDF</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.deleteTourBtn}
						onPress={handleDeleteTour}
					>
						<Text style={styles.deleteTourText}>Eliminar este tour</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	headerImage: { width: '100%', height: 220 },
	placeholderImage: { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
	titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
	editBadge: {
		flexDirection: 'row',
		backgroundColor: colors.primary,
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 15,
		alignItems: 'center',
	},
	editBadgeText: { color: 'white', fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: spacing.xl
	},
	addButton: { backgroundColor: colors.secondary, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
	addButtonText: { color: colors.primary, fontWeight: 'bold', fontSize: 13 },
	stopCard: {
		flexDirection: 'row',
		backgroundColor: 'white',
		padding: spacing.md,
		borderRadius: 12,
		marginBottom: spacing.md,
		alignItems: 'center',
	},
	stopNumber: {
		backgroundColor: colors.primary,
		width: 26,
		height: 26,
		borderRadius: 13,
		justifyContent: 'center',
		alignItems: 'center',
	},
	stopNumberText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
	stopActions: { flexDirection: 'row', marginTop: 4, gap: 15 },
	actionLink: { fontSize: 12, color: colors.primary, fontWeight: '600' },
	footer: { marginTop: spacing.xl, paddingBottom: spacing.xl },
	mainButton: {
		flexDirection: 'row',
		paddingVertical: spacing.md,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: spacing.md
	},
	mainButtonText: { ...typography.button, color: 'white', fontSize: 16 },
	deleteTourBtn: { marginTop: spacing.md, alignItems: 'center' },
	deleteTourText: { color: colors.error, textDecorationLine: 'underline', fontWeight: '600' },
	emptyText: { color: colors.textLight, fontStyle: 'italic', textAlign: 'center' },
});