import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gamepad2, Smartphone, PenTool, Box } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <AbstractBackground />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.avatarPlaceholder}>
                        <Image source={require('../../assets/me.jpeg')} style={styles.avatarImage} resizeMode="cover" />
                    </View>
                    <Text style={styles.title}>Game Developer</Text>
                    <Text style={styles.subtitle}>Coder • React Native • Modeling • Sculpting • Narrative Designer</Text>
                    <Text style={styles.description}>
                        Bridging the gap between imagination and reality through code, art, and immersive storytelling.
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>My Domains</Text>

                {/* Skills Grid */}
                <View style={styles.grid}>
                    <SkillCard
                        icon={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../assets/unreal_icon.png')} style={{ width: 44, height: 44, tintColor: colors.text, marginRight: 8 }} resizeMode="contain" />
                                <Image source={require('../../assets/unity_icon.png')} style={{ width: 44, height: 44, tintColor: colors.text }} resizeMode="contain" />
                            </View>
                        }
                        title="Game Dev"
                        desc="Unreal Engine & Unity"
                        onPress={() => navigation.navigate('Projects', { filter: 'Game Dev' })}
                    />
                    <SkillCard
                        icon={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../assets/react_icon.png')} style={{ width: 44, height: 44, tintColor: colors.text, marginRight: 8 }} resizeMode="contain" />
                                <Image source={require('../../assets/expo_icon.png')} style={{ width: 44, height: 44, tintColor: colors.text }} resizeMode="contain" />
                            </View>
                        }
                        title="Mobile Apps"
                        desc="React Native & Expo"
                        onPress={() => navigation.navigate('Projects', { filter: 'Mobile App' })}
                    />
                    <SkillCard
                        icon={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../assets/blender_icon.png')} style={{ width: 44, height: 44, tintColor: colors.text, marginRight: 8 }} resizeMode="contain" />
                                <Image source={require('../../assets/substance_icon.png')} style={{ width: 44, height: 44, tintColor: colors.text }} resizeMode="contain" />
                            </View>
                        }
                        title="3D Art"
                        desc="Modeling & Texturing"
                        onPress={() => navigation.navigate('Projects', { filter: '3D Art' })}
                    />
                    <SkillCard
                        icon={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../assets/inky_icon.png')} style={{ width: 44, height: 44 }} resizeMode="contain" />
                            </View>
                        }
                        title="Writing"
                        desc="Worldbuilding & Lore"
                        onPress={() => navigation.navigate('Projects', { filter: 'Writing / Lore' })}
                    />
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
};

const SkillCard = ({ icon, title, desc, onPress }: any) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ width: '48%', marginBottom: 16 }}>
        <GlassCard style={styles.skillCard} intensity={25}>
            <View style={styles.iconContainer}>{icon}</View>
            <Text style={styles.skillTitle}>{title}</Text>
            <Text style={styles.skillDesc}>{desc}</Text>
        </GlassCard>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    heroSection: {
        marginBottom: 40,
        marginTop: 40,
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: colors.primary,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 1.5,
    },
    description: {
        fontSize: 15,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    skillCard: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(20, 20, 20, 0.5)',
    },
    iconContainer: {
        marginBottom: 16,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skillTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 6,
        textAlign: 'center',
    },
    skillDesc: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 18,
    }
});
