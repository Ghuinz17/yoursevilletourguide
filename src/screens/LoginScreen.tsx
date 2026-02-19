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

interface LoginScreenProps {
    navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            await signIn(email.trim(), password);
        } catch (error: any) {
            Alert.alert('Error de acceso', error.message || 'Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background }}>
                <View style={{ marginBottom: spacing.xxl }}>
                    <Text style={{ ...typography.h1, color: colors.primary, textAlign: 'center' }}>Bienvenido</Text>
                    <Text style={{ ...typography.body, color: colors.textLight, textAlign: 'center', marginTop: spacing.xs }}>Inicia sesión para continuar</Text>
                </View>

                <View style={{ gap: spacing.md }}>
                    <View>
                        <Text style={{ ...typography.body, marginBottom: spacing.xs, fontWeight: '600' }}>Email</Text>
                        <TextInput
                            style={{ height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.md, color: colors.text }}
                            placeholder="tu@email.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text style={{ ...typography.body, marginBottom: spacing.xs, fontWeight: '600' }}>Contraseña</Text>
                        <TextInput
                            style={{ height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.md, color: colors.text }}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        style={{ backgroundColor: colors.primary, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: spacing.md, opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? <ActivityIndicator color="white" /> : <Text style={{ ...typography.button, color: 'white' }}>Iniciar Sesión</Text>}
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md }}>
                        <Text style={{ color: colors.textLight }}>¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Regístrate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};