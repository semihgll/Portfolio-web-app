import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20 }) => {
    return (
        <BlurView
            intensity={intensity}
            tint="dark"
            style={[styles.container, style]}
        >
            {children}
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        backgroundColor: colors.card,
        overflow: 'hidden',
    },
});
