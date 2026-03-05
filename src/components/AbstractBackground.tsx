import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const AbstractBackground = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 10000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 10000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [animatedValue]);

    const translateY1 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, 50],
    });

    const translateX1 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, 100],
    });

    const translateY2 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [50, -50],
    });

    const scale = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    return (
        <Animated.View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={['#000000', '#0a0a0a']}
                style={StyleSheet.absoluteFill}
            />

            {/* Abstract Shape 1 */}
            <Animated.View
                style={[
                    styles.blob,
                    {
                        top: '10%',
                        left: '20%',
                        transform: [
                            { translateY: translateY1 },
                            { translateX: translateX1 },
                            { scale },
                        ],
                    },
                ]}
            >
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.01)']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>

            {/* Abstract Shape 2 */}
            <Animated.View
                style={[
                    styles.blob,
                    {
                        bottom: '20%',
                        right: '10%',
                        width: 400,
                        height: 400,
                        transform: [
                            { translateY: translateY2 },
                            { scale },
                        ],
                    },
                ]}
            >
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0)']}
                    style={styles.gradient}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        overflow: 'hidden',
        filter: 'blur(40px)', // Web için blur efekti
    },
    gradient: {
        flex: 1,
    },
});
