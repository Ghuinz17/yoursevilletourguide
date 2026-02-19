// App.tsx
/**
 * Componente Principal de la Aplicación
 * 
 * Responsabilidades:
 * 1. Cargar fuentes personalizadas
 * 2. Envolver con AuthProvider
 * 3. Mostrar RootNavigator
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';

import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/constants/theme';

/**
 * App Principal
 */
export default function App() {
	const [fontsLoaded, setFontsLoaded] = React.useState(false);

	/**
	 * Cargar fuentes personalizadas
	 */
	useEffect(() => {
		async function loadFonts() {
			try {
				await Font.loadAsync({
					'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
					'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
				});
				setFontsLoaded(true);
			} catch (error) {
				// Si hay error, continuar de todas formas
				console.log('Fonts not loaded, continuing with defaults');
				setFontsLoaded(true);
			}
		}

		loadFonts();
	}, []);

	// Mostrar loading mientras se cargan las fuentes
	if (!fontsLoaded) {
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
		<AuthProvider>
			<RootNavigator />
		</AuthProvider>
	);
}