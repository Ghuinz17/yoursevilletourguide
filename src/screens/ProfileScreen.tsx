import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { profileService, tourService } from '../services/supabase';
import { colors, spacing, typography, shadows } from '../constants/theme';
import { Profile } from '../types';

export const ProfileScreen = () => {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [tourCount, setTourCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (user) loadProfileData(); }, [user]);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            if (!user) return;

            const [profileRes, toursRes] = await Promise.all([
                profileService.getProfile(user.id),
                tourService.getAllTours()
            ]);

            if (profileRes.error && profileRes.error.code === 'PGRST116') {
                const { data: newProfile } = await profileService.createProfile({
                    id: user.id,
                    username: user.email?.split('@')[0] || 'Usuario',
                    profile_image: ''
                });
                setProfile(newProfile);
            } else {
                setProfile(profileRes.data);
            }

            const userTours = toursRes.data?.filter(t => t.created_by === user.id) || [];
            setTourCount(userTours.length);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={[styles.profileHeader, shadows.medium]}>
                <View style={styles.avatarContainer}>
                    {profile?.profile_image ? (
                        <Image source={{ uri: profile.profile_image }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarLetter}>{profile?.username?.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                </View>
                <Text style={typography.h2}>{profile?.username}</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statCard, shadows.small]}>
                    <Text style={styles.statNumber}>{tourCount}</Text>
                    <Text style={styles.statLabel}>Tours creados</Text>
                </View>
                <View style={[styles.statCard, shadows.small]}>
                    <Text style={styles.statNumber}>Sevilla</Text>
                    <Text style={styles.statLabel}>Ciudad base</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => Alert.alert("Cerrar Sesión", "¿Seguro?", [{ text: "No" }, { text: "Sí", onPress: signOut }])} style={styles.signOutBtn}>
                    <Text style={styles.signOutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: colors.background, padding: spacing.lg },
    profileHeader: { backgroundColor: 'white', padding: spacing.xl, borderRadius: 20, alignItems: 'center', marginBottom: spacing.lg },
    avatarContainer: { marginBottom: spacing.md },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
    avatarLetter: { color: 'white', fontSize: 40, fontWeight: 'bold' },
    emailText: { ...typography.body, color: colors.textLight, marginTop: 4 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
    statCard: { backgroundColor: 'white', flex: 0.48, padding: spacing.md, borderRadius: 12, alignItems: 'center' },
    statNumber: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: 12, color: colors.textLight },
    actions: { marginTop: 'auto' },
    signOutBtn: { padding: spacing.md, borderRadius: 8, borderWidth: 2, borderColor: colors.error, alignItems: 'center' },
    signOutText: { ...typography.button, color: colors.error }
});