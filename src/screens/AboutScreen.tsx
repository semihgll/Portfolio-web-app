import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Code, Layers, MessageSquare, Terminal } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';

export const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <AbstractBackground />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <Text style={styles.title}>About Me</Text>
                    <Text style={styles.subtitle}>The story behind the pixels</Text>
                </View>

                <GlassCard style={styles.bioCard} intensity={20}>
                    <Text style={styles.bioText}>
                        I am a multi-disciplinary developer with a deep passion for bringing ideas to life. Whether it's coding a robust mobile application in React Native, designing an immersive 3D world in Unreal Engine, or writing intricate lore for a game narrative, I thrive at the exciting intersection of technology and art.
                    </Text>
                    <Text style={[styles.bioText, { marginTop: 16 }]}>
                        My diverse background allows me to approach problems from unique angles, blending logical programming patterns with creative design thinking.
                    </Text>
                </GlassCard>

                <Text style={styles.sectionTitle}>Tech Stack</Text>

                <View style={styles.stackGrid}>
                    <StackItem icon={<Terminal color={colors.primary} size={24} />} name="Unreal C++" />
                    <StackItem icon={<Code color={colors.primary} size={24} />} name="React Native" />
                    <StackItem icon={<Layers color={colors.primary} size={24} />} name="Blender 3D" />
                    <StackItem icon={<MessageSquare color={colors.primary} size={24} />} name="Creative Writing" />
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
};

const StackItem = ({ icon, name }: any) => (
    <View style={styles.stackItem}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={styles.stackName}>{name}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
        marginTop: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
    },
    bioCard: {
        padding: 24,
        marginBottom: 30,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    bioText: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 28,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
        marginLeft: 4,
    },
    stackGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    stackItem: {
        width: '48%',
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconWrapper: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
    },
    stackName: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    }
});
