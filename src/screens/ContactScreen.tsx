import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';

export const ContactScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.container}>
            <AbstractBackground />
            <View style={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.title}>Let's Connect</Text>
                    <Text style={styles.subtitle}>Open for collaborations and opportunities.</Text>
                </View>

                <GlassCard style={styles.card} intensity={25}>
                    <SocialButton icon={<Mail color={colors.text} size={24} />} title="semihgll@icloud.com" url="mailto:semihgll@icloud.com" />
                    {/*<SocialButton icon={<Github color={colors.text} size={24} />} title="github.com/creator" url="https://github.com/creator" />*/}
                    <SocialButton icon={<Linkedin color={colors.text} size={24} />} title="Linkedin" url="https://linkedin.com/in/semih-gul" />
                    <SocialButton icon={<FontAwesome5 name="artstation" color={colors.text} size={24} />} title="Artstation" url="https://artstation.com/semihgul" />
                </GlassCard>

                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Admin')}
                    >
                        <Text style={styles.footerText}>Designed & Built with Expo + React Native</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

const SocialButton = ({ icon, title, url }: any) => {
    const handlePress = async () => {
        if (url) {
            try {
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                } else {
                    Alert.alert(`Bağlantı açılamıyor`, `URL: ${url}`);
                }
            } catch (error) {
                console.error("An error occurred", error);
            }
        }
    };

    return (
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} onPress={handlePress}>
            <View style={styles.iconBox}>{icon}</View>
            <Text style={styles.socialText}>{title}</Text>
        </TouchableOpacity>
    );
};

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
