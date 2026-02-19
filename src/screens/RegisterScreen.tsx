// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../constants/theme';

export function RegisterScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signUp, loading } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            await signUp(email.trim(), password, name.trim());
            Alert.alert('¡Éxito!', 'Cuenta creada. Ya puedes iniciar sesión.');
            navigation.navigate('Login');
        } catch (err: any) {
            Alert.alert('Error al registrar', err.message || 'No se pudo crear la cuenta');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.xl, backgroundColor: colors.background }}>
                <Text style={{ ...typography.h1, color: colors.primary, marginBottom: spacing.xl }}>Crear Cuenta</Text>

                <View style={{ gap: spacing.md }}>
                    <Text>Nombre</Text>
                    <TextInput
                        style={{ height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.md }}
                        placeholder="Nombre completo"
                        value={name}
                        onChangeText={setName}
                    />
                    <Text>Email</Text>
                    <TextInput
                        style={{ height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.md }}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <Text>Contraseña</Text>
                    <TextInput
                        style={{ height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.md }}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Text>Confirmar contraseña</Text>
                    <TextInput
                        style={{ height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.md }}
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        style={{ backgroundColor: colors.primary, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: spacing.md }}
                    >
                        {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Registrarse</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}