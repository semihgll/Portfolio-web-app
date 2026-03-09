import React, { useEffect } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

interface ProfessionalVideoPlayerProps {
    source: string | null;
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    isMuted?: boolean;
    loop?: boolean;
    autoPlay?: boolean;
}

export default function ProfessionalVideoPlayer({
    source,
    style,
    containerStyle,
    isMuted = true,
    loop = true,
    autoPlay = true,
}: ProfessionalVideoPlayerProps) {
    const player = useVideoPlayer(source, (player) => {
        player.loop = loop;
        player.muted = isMuted;
        if (autoPlay) {
            player.play();
        }
    });

    // Handle source changes
    useEffect(() => {
        if (player && source) {
            player.replace(source);
            if (autoPlay) {
                player.play();
            }
        }
    }, [source]);

    if (!source) return null;

    return (
        <View style={[styles.container, containerStyle]}>
            <VideoView
                style={[styles.video, style]}
                player={player}
                nativeControls={false} // Disable native controls to look like a GIF
                contentFit="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});
