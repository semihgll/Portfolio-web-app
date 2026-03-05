import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';

export const GameDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const game = route.params?.game;

    if (!game) return null;

    return (
        <View style={styles.container}>
            <AbstractBackground />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header with Back */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
                        <ChevronLeft color={colors.text} size={32} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{game.title}</Text>
                    </View>
                    {game.engineIcon && (
                        <Image source={game.engineIcon} style={styles.headerEngineIcon} resizeMode="contain" />
                    )}
                </View>

                {/* Game Banner / Cover */}
                {game.cover ? (
                    <Image source={game.cover} style={styles.coverImage} resizeMode="cover" />
                ) : (
                    <GlassCard style={styles.coverPlaceholder} intensity={20}>
                        <Text style={styles.coverPlaceholderText}>Game</Text>
                        <Text style={styles.coverSubText}>Oyun görseli ekle</Text>
                    </GlassCard>
                )}

                {/* Info Card */}
                <GlassCard style={styles.infoCard} intensity={20}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Motor</Text>
                        <Text style={styles.infoValue}>{game.engine || '—'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Platform</Text>
                        <Text style={styles.infoValue}>{game.platform || '—'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Durum</Text>
                        <Text style={styles.infoValue}>{game.status || '—'}</Text>
                    </View>
                </GlassCard>

                {/* Description */}
                <GlassCard style={styles.descCard} intensity={20}>
                    <Text style={styles.descTitle}>Hakkında</Text>
                    <Text style={styles.descText}>{game.description}</Text>
                </GlassCard>

                {/* Awards */}
                {game.awards && game.awards.length > 0 && (
                    <>
                        <Text style={styles.sectionLabel}>Awards</Text>
                        {game.awards.map((award: any, index: number) => (
                            <GlassCard key={index} style={styles.awardCard} intensity={20}>
                                <View style={styles.awardRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.awardTitle}>{award.title}</Text>
                                        <Text style={styles.awardEvent}>{award.event}</Text>
                                    </View>
                                    <Text style={[styles.awardRank, { color: award.rankColor }]}>
                                        {award.rank}
                                    </Text>
                                </View>
                            </GlassCard>
                        ))}
                    </>
                )}

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 10,
    },
    backBtn: {
        marginRight: 10,
        padding: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.text,
    },
    headerEngineIcon: {
        width: 36,
        height: 36,
        tintColor: colors.text,
        marginLeft: 12,
    },
    coverImage: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 20,
    },
    coverPlaceholder: {
        width: '100%',
        height: 180,
        borderRadius: 16,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    coverPlaceholderText: {
        fontSize: 48,
        marginBottom: 8,
    },
    coverSubText: {
        color: colors.textMuted,
        fontSize: 14,
    },
    infoCard: {
        padding: 20,
        marginBottom: 16,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    descCard: {
        padding: 20,
        marginBottom: 16,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    descTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 10,
    },
    descText: {
        fontSize: 15,
        color: colors.textMuted,
        lineHeight: 24,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
        marginTop: 8,
    },
    awardCard: {
        padding: 16,
        marginBottom: 10,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    awardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    awardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 2,
    },
    awardEvent: {
        fontSize: 13,
        color: colors.textMuted,
    },
    awardRank: {
        fontSize: 14,
        fontWeight: '800',
        marginLeft: 12,
    },
});
