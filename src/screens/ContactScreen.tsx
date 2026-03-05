import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';

export const ContactScreen = () => {
    return (
        <View style={styles.container}>
            <AbstractBackground />
            <View style={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.title}>Let's Connect</Text>
                    <Text style={styles.subtitle}>Open for collaborations and opportunities.</Text>
                </View>

                <GlassCard style={styles.card} intensity={25}>
                    <SocialButton icon={<Mail color={colors.text} size={24} />} title="hello@creator.dev" />
                    <SocialButton icon={<Github color={colors.text} size={24} />} title="github.com/creator" />
                    <SocialButton icon={<Linkedin color={colors.text} size={24} />} title="linkedin.com/in/creator" />
                    <SocialButton icon={<Twitter color={colors.text} size={24} />} title="@creator_dev" />
                </GlassCard>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Designed & Built with Expo + React Native</Text>
                </View>

            </View>
        </View>
    );
};

const SocialButton = ({ icon, title }: any) => (
    <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.socialText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 80,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
    },
    card: {
        padding: 24,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    socialText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 100, // accommodate bottom tabs
        alignItems: 'center',
    },
    footerText: {
        color: colors.textMuted,
        fontSize: 12,
    }
});
