import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Pressable, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, X } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';

export const GameDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const game = route.params?.game;
    const [selectedImage, setSelectedImage] = useState<any>(null);

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

                {/* Top Banner moved to bottom */}
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

                {/* Video Section */}
                {game.youtubeId && (
                    <>
                        <Text style={styles.sectionLabel}>Video</Text>
                        <GlassCard style={styles.videoCard} intensity={20}>
                            <View style={styles.videoContainer}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${game.youtubeId}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ borderRadius: 12 }}
                                />
                            </View>
                        </GlassCard>
                    </>
                )}

                {/* Gallery Section */}
                {game.images && game.images.length > 0 && (
                    <>
                        <Text style={styles.sectionLabel}>Gallery</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.galleryScroll}
                        >
                            {game.images.map((img: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedImage(img)}
                                >
                                    <GlassCard style={styles.galleryCard} intensity={20}>
                                        <Image source={img} style={styles.galleryImage} resizeMode="cover" />
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* Modal for Full Screen Image */}
                <Modal
                    visible={!!selectedImage}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectedImage(null)}
                >
                    <View style={styles.modalOverlay}>
                        <Pressable
                            style={styles.modalBgClose}
                            onPress={() => setSelectedImage(null)}
                        />
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.modalCloseBtn}
                                onPress={() => setSelectedImage(null)}
                            >
                                <X color="#fff" size={32} />
                            </TouchableOpacity>
                            {selectedImage && (
                                <Image
                                    source={selectedImage}
                                    style={styles.fullImage}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                    </View>
                </Modal>

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

                {/* Game Banner / Cover (Moved to bottom) */}
                {game.cover && (
                    <Image
                        source={game.cover}
                        style={[styles.coverImage, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
                        resizeMode="contain"
                    />
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
        height: Dimensions.get('window').height * 0.8,
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
    videoCard: {
        padding: 0,
        marginBottom: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    galleryScroll: {
        paddingRight: 20,
        paddingBottom: 4,
    },
    galleryCard: {
        padding: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
        width: 280,
        height: 160,
        marginRight: 12,
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBgClose: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseBtn: {
        position: 'absolute',
        top: -40,
        right: 0,
        zIndex: 10,
    },
    fullImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
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
