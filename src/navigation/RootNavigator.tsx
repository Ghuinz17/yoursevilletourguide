import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';


export type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	ToursTab: undefined;
	TourDetail: { tourId: string };

	TourForm: { tourId?: string };
	EditTour: { tourId: string };

	StopForm: { tourId: string; stopId?: string };
	StopDetail: { stopId: string; tourId: string };
	EditStop: { stopId: string; tourId: string };
	
	Map: { tourId: string };
	PDFReport: { tourId: string };
	ChatTab: undefined;
	ProfileTab: undefined;
};


import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ToursListScreen } from '../screens/ToursListScreen';
import { TourDetailScreen } from '../screens/TourDetailScreen';
import { TourFormScreen } from '../screens/TourFormScreen';
import { EditTourScreen } from '../screens/EditTourScreen';
import { StopFormScreen } from '../screens/StopFormScreen';
import { StopDetailScreen } from '../screens/StopDetailScreen';
import { EditStopScreen } from '../screens/EditStopScreen';
import { MapScreen } from '../screens/MapScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { PDFReportScreen } from '../screens/PDFReportScreen';
import { ProfileScreen } from '../screens/ProfileScreen';


const AuthStack = createNativeStackNavigator<RootStackParamList>();
const ToursStack = createNativeStackNavigator<RootStackParamList>();
const ChatStack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

function ToursStackNavigator() {
	return (
		<ToursStack.Navigator
			screenOptions={{
				headerTintColor: colors.primary,
				headerBackTitle: 'Volver',
			}}>
			<ToursStack.Screen
				name="ToursTab"
				component={ToursListScreen}
				options={{ title: 'Mis Tours' }}
			/>
			<ToursStack.Screen
				name="TourDetail"
				component={TourDetailScreen}
				options={{ title: 'Detalle del Tour' }}
			/>
			<ToursStack.Screen 
				name="TourForm" 
				component={TourFormScreen} 
				options={{ title: 'Nuevo Tour' }} 
			/>
			<ToursStack.Screen 
				name="EditTour" 
				component={EditTourScreen} 
				options={{ title: 'Editar Tour' }} 
			/>
			<ToursStack.Screen
				name="StopForm"
				component={StopFormScreen}
				options={({ route }) => ({
					title: route.params?.stopId ? 'Editar Parada' : 'Nueva Parada',
				})}
			/>
			<ToursStack.Screen 
				name="EditStop" 
				component={EditStopScreen} 
				options={{ title: 'Editar Parada' }} 
			/>
			<ToursStack.Screen
				name="StopDetail"
				component={StopDetailScreen}
				options={{ title: 'Información de Parada' }}
			/>
			<ToursStack.Screen
				name="Map"
				component={MapScreen}
				options={{ title: 'Mapa' }}
			/>
			<ToursStack.Screen
				name="PDFReport"
				component={PDFReportScreen}
				options={{ title: 'Reporte PDF' }}
			/>
		</ToursStack.Navigator>
	);
}

function MainTabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';
					if (route.name === 'ToursTab') iconName = 'map';
					else if (route.name === 'ChatTab') iconName = 'chatbubbles';
					else if (route.name === 'ProfileTab') iconName = 'person';
					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: 'gray',
				headerShown: false,
			})}>
			<Tab.Screen
				name="ToursTab"
				component={ToursStackNavigator}
				options={{ title: 'Tours' }}
			/>
			<Tab.Screen
				name="ChatTab"
				component={ChatScreen}
				options={{ title: 'Chat' }}
			/>
			<Tab.Screen
				name="ProfileTab"
				component={ProfileScreen}
				options={{ title: 'Perfil' }}
			/>
		</Tab.Navigator>
	);
}

export function RootNavigator() {
	const { loading, isAuthenticated } = useAuth();

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.background,
				}}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	return (
		<NavigationContainer>
			{isAuthenticated ? (
				<MainTabNavigator />
			) : (
				<AuthStack.Navigator screenOptions={{ headerShown: false }}>
					<AuthStack.Screen name="Login" component={LoginScreen} />
					<AuthStack.Screen name="Register" component={RegisterScreen} />
				</AuthStack.Navigator>
			)}
		</NavigationContainer>
	);
}