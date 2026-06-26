import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Pressable, Dimensions, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, X } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';
import ProfessionalVideoPlayer from '../components/ProfessionalVideoPlayer';

const getBlueprintRenderUrl = (urlOrId: string) => {
    if (!urlOrId) return '';
    const trimmed = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        return `https://blueprintue.com/render/${trimmed}/`;
    }
    const match = trimmed.match(/blueprintue\.com\/(blueprint|render)\/([a-zA-Z0-9_-]+)/);
    if (match && match[2]) {
        return `https://blueprintue.com/render/${match[2]}/`;
    }
    if (trimmed.startsWith('http') || trimmed.startsWith('//')) {
        return trimmed;
    }
    return `https://blueprintue.com/render/${trimmed}/`;
};

export const GameDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const game = route.params?.game;
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [activeBlueprintIdx, setActiveBlueprintIdx] = useState(0);

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
                    {game.engine && (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Engine</Text>
                                <Text style={styles.infoValue}>{game.engine}</Text>
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Platform</Text>
                        <Text style={styles.infoValue}>{game.platform || '—'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <Text style={styles.infoValue}>{game.status || '—'}</Text>
                    </View>
                </GlassCard>

                {/* Description */}
                <GlassCard style={styles.descCard} intensity={20}>
                    <Text style={styles.descTitle}>About</Text>
                    <Text style={styles.descText}>{game.description}</Text>
                </GlassCard>

                {/* Video Section */}
                {(game.video || game.videoUrl || game.youtubeId) && (
                    <>
                        <Text style={styles.sectionLabel}>Video</Text>
                        <GlassCard style={styles.videoCard} intensity={20}>
                            <View style={styles.videoContainer}>
                                {game.video || game.videoUrl ? (
                                    <ProfessionalVideoPlayer
                                        source={game.video || game.videoUrl}
                                        style={{ borderRadius: 12 }}
                                    />
                                ) : (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${game.youtubeId}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        style={{ borderRadius: 12 }}
                                    />
                                )}
                            </View>
                        </GlassCard>
                    </>
                )}

                {/* Blueprints Section */}
                {game.blueprints && game.blueprints.length > 0 && (
                    <>
                        <Text style={styles.sectionLabel}>Blueprints</Text>
                        <View style={styles.blueprintContainer}>
                            {game.blueprints.length > 1 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.blueprintTabs}
                                >
                                    {game.blueprints.map((bp: any, index: number) => (
                                        <TouchableOpacity
                                            key={`bp-tab-${index}`}
                                            style={[
                                                styles.blueprintTab,
                                                activeBlueprintIdx === index && styles.blueprintTabActive
                                            ]}
                                            onPress={() => setActiveBlueprintIdx(index)}
                                            activeOpacity={0.8}
                                        >
                                            <Text
                                                style={[
                                                    styles.blueprintTabText,
                                                    activeBlueprintIdx === index && styles.blueprintTabTextActive
                                                ]}
                                            >
                                                {bp.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}

                            <GlassCard style={styles.blueprintCard} intensity={20}>
                                <View style={styles.blueprintHeader}>
                                    <Text style={styles.blueprintTitle}>
                                        {game.blueprints[activeBlueprintIdx]?.title || 'Blueprint'}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const url = getBlueprintRenderUrl(game.blueprints[activeBlueprintIdx]?.url);
                                            const match = url.match(/blueprintue\.com\/render\/([a-zA-Z0-9_-]+)/);
                                            const targetUrl = match && match[1]
                                                ? `https://blueprintue.com/blueprint/${match[1]}/`
                                                : url;
                                            if (Platform.OS === 'web' && targetUrl) {
                                                window.open(targetUrl, '_blank');
                                            }
                                        }}
                                        style={styles.blueprintLinkBtn}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.blueprintLinkText}>Open in blueprintue.com</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.blueprintIframeContainer}>
                                    {game.blueprints[activeBlueprintIdx] && (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={getBlueprintRenderUrl(game.blueprints[activeBlueprintIdx].url)}
                                            frameBorder="0"
                                            scrolling="no"
                                            allowFullScreen
                                            style={{ borderRadius: 8, backgroundColor: '#151515' }}
                                        />
                                    )}
                                </View>
                                <Text style={styles.blueprintHelpText}>
                                    💡 Drag to pan. Scroll wheel (or pinch zoom) to zoom the node graph.
                                </Text>
                            </GlassCard>
                        </View>
                    </>
                )}

                {/* Gallery Section - Local images */}
                {game.images && game.images.length > 0 && (
                    <>
                        <Text style={styles.sectionLabel}>Gallery</Text>
                        <View style={styles.galleryGrid}>
                            {game.images.map((img: any, index: number) => (
                                <TouchableOpacity
                                    key={`local-${index}`}
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedImage(img)}
                                    style={styles.galleryItemWrapper}
                                >
                                    <GlassCard style={styles.galleryCard} intensity={20}>
                                        <Image source={img} style={styles.galleryImage} resizeMode="cover" />
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* Gallery Section - URL images from Firestore */}
                {game.imageUrls && game.imageUrls.length > 0 && (
                    <>
                        {!(game.images && game.images.length > 0) && (
                            <Text style={styles.sectionLabel}>Gallery</Text>
                        )}
                        <View style={styles.galleryGrid}>
                            {game.imageUrls.map((url: string, index: number) => (
                                <TouchableOpacity
                                    key={`url-${index}`}
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedImage({ uri: url })}
                                    style={styles.galleryItemWrapper}
                                >
                                    <GlassCard style={styles.galleryCard} intensity={20}>
                                        <Image source={{ uri: url }} style={styles.galleryImage} resizeMode="cover" />
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </View>
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

                {/* Dev Logs */}
                {game.devLogs && game.devLogs.length > 0 && (
                    <>
                        <Text style={styles.sectionLabel}>Dev Log</Text>
                        <View style={styles.devLogContainer}>
                            {game.devLogs.map((log: any, index: number) => (
                                <GlassCard key={`devlog-${index}`} style={styles.devLogCard} intensity={20}>
                                    <View style={styles.devLogHeader}>
                                        <Text style={styles.devLogDate}>{log.date}</Text>
                                        {log.version && (
                                            <View style={styles.devLogVersionBadge}>
                                                <Text style={styles.devLogVersionText}>{log.version}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.devLogTitle}>{log.title}</Text>
                                    
                                    {log.images && log.images.length > 0 && (
                                        <View style={styles.devLogImagesGrid}>
                                            {log.images.map((img: any, imgIdx: number) => (
                                                <TouchableOpacity
                                                    key={`dl-img-${imgIdx}`}
                                                    activeOpacity={0.9}
                                                    onPress={() => setSelectedImage(img)}
                                                    style={styles.devLogImageWrapper}
                                                >
                                                    <Image source={img} style={styles.devLogImage} resizeMode="cover" />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    <View style={styles.divider} />
                                    <Text style={styles.devLogContent}>{log.content}</Text>
                                </GlassCard>
                            ))}
                        </View>
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
    galleryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 4,
    },
    galleryItemWrapper: {
        marginRight: 12,
        marginBottom: 12,
    },
    galleryCard: {
        padding: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
        width: 280,
        height: 160,
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
    devLogContainer: {
        marginBottom: 16,
    },
    devLogCard: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    devLogHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    devLogDate: {
        fontSize: 13,
        color: colors.textMuted,
        fontWeight: '600',
    },
    devLogVersionBadge: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    devLogVersionText: {
        fontSize: 11,
        color: colors.primary,
        fontWeight: 'bold',
    },
    devLogTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    devLogContent: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 24,
        marginTop: 12,
    },
    devLogImagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
        gap: 8,
    },
    devLogImageWrapper: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 130,
        height: 140,
        borderRadius: 8,
        overflow: 'hidden',
    },
    devLogImage: {
        width: '100%',
        height: '100%',
    },
    blueprintContainer: {
        marginBottom: 20,
    },
    blueprintTabs: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 8,
    },
    blueprintTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    blueprintTabActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: '#fff',
    },
    blueprintTabText: {
        fontSize: 13,
        color: colors.textMuted,
        fontWeight: '600',
    },
    blueprintTabTextActive: {
        color: '#fff',
    },
    blueprintCard: {
        padding: 20,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    blueprintHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8,
    },
    blueprintTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    blueprintLinkBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    blueprintLinkText: {
        fontSize: 12,
        color: colors.textMuted,
        textDecorationLine: 'underline',
    },
    blueprintIframeContainer: {
        width: '100%',
        height: 500,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: '#151515',
    },
    blueprintHelpText: {
        fontSize: 11,
        color: colors.textMuted,
        marginTop: 8,
        textAlign: 'center',
    },
});
