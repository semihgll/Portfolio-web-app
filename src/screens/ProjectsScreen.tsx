import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';
import { db } from '../config/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

// ————— Local asset map (hardcoded görseller için) —————
const ENGINE_ICONS: Record<string, any> = {
    'Unity': require('../../assets/unity_icon.png'),
    'Unreal Engine': require('../../assets/unreal_icon.png'),
};

const LOCAL_IMAGES: Record<string, any[]> = {
    'Astroneer': [require('../../assets/astro_dialog.png'), require('../../assets/astro_env.png'), require('../../assets/astro_menu.png')],
    'Whisper Woods': [require('../../assets/ww_chase.png'), require('../../assets/ww_esc.png'), require('../../assets/ww_mm.png'), require('../../assets/ww_esc.png'), require('../../assets/ww_text.png')],
    'Empire Conquest': [require('../../assets/eq_win.png'), require('../../assets/eq_start.png'), require('../../assets/eq_mm.png'), require('../../assets/eq_gp.png'), require('../../assets/eq_game.png')],
    'Forgotten Inventions': [require('../../assets/fi_gm.png'), require('../../assets/fi_gpz_.png'), require('../../assets/fi_bomb.png'), require('../../assets/fi_mm.png'), require('../../assets/fi_tt.png')],
    'Ikarus Sculpture': [require('../../assets/icarus.png')],
};

const LOCAL_COVERS: Record<string, any> = {
    'Forgotten Inventions': require('../../assets/fi_cover.jpg'),
};

const LOCAL_AWARDS: Record<string, any[]> = {
    'Abonetor': [
        { title: 'Netmarble Game Jam & Incubation Program', event: 'Incube Programında Barış Özistek gibi değerli insanlardan pazarlama ve geliştirme konusunda çok değerli eğitimler aldık. Bu programı 2.likle bitirdik. Çok değerli ödüller aldık.', rank: '2st Place', rankColor: '#ffffffff' },
    ],
};

interface FirestoreProject {
    id: string;
    title: string;
    category: string;
    description: string;
    status?: string;
    platform?: string;
    engine?: string;
    youtubeId?: string;
    order?: number;
    coverUrl?: string;
    imageUrls?: string[];
}

export const ProjectsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const filterCat = route.params?.filter || null;
    const [projects, setProjects] = useState<FirestoreProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as FirestoreProject[];
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
        setLoading(false);
    };

    const isGameDev = filterCat === 'Game Dev';

    // Filter projects by category
    const filteredProjects = filterCat
        ? projects.filter(p => p.category === filterCat)
        : projects;

    // Enrich project with local assets for navigation
    const enrichProject = (project: FirestoreProject) => {
        const enriched: any = { ...project };
        // Add engine icon
        if (project.engine && ENGINE_ICONS[project.engine]) {
            enriched.engineIcon = ENGINE_ICONS[project.engine];
        }
        // Add local images if no Firestore imageUrls
        if ((!project.imageUrls || project.imageUrls.length === 0) && LOCAL_IMAGES[project.title]) {
            enriched.images = LOCAL_IMAGES[project.title];
        }
        // Add local cover
        if (!project.coverUrl && LOCAL_COVERS[project.title]) {
            enriched.cover = LOCAL_COVERS[project.title];
        }
        // Add awards
        if (LOCAL_AWARDS[project.title]) {
            enriched.awards = LOCAL_AWARDS[project.title];
        }
        return enriched;
    };

    return (
        <View style={styles.container}>
            <AbstractBackground />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.backBtn} activeOpacity={0.7}>
                        <ChevronLeft color={colors.text} size={32} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>{filterCat ? filterCat : 'Selected Works'}</Text>
                        <Text style={styles.subtitle}>
                            {filterCat ? `My projects in ${filterCat}` : 'A collection of my latest endeavors'}
                        </Text>
                    </View>
                </View>

                {/* Loading */}
                {loading && (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                )}

                {/* Game Dev projects */}
                {isGameDev && filteredProjects.map((project) => {
                    const enriched = enrichProject(project);
                    return (
                        <TouchableOpacity
                            key={project.id}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('GameDetail', { game: enriched })}
                        >
                            <GlassCard style={styles.gameCard} intensity={20}>
                                <View style={styles.gameCardContent}>
                                    <View style={styles.gameInfo}>
                                        <Text style={styles.gameTitle}>{project.title}</Text>
                                        <View style={styles.engineRow}>
                                            {enriched.engineIcon && (
                                                <Image
                                                    source={enriched.engineIcon}
                                                    style={styles.engineIconSmall}
                                                    resizeMode="contain"
                                                />
                                            )}
                                            {project.engine && (
                                                <Text style={styles.gameEngine}>{project.engine}</Text>
                                            )}
                                        </View>
                                        {project.status && (
                                            <Text style={styles.gameStatus}>{project.status}</Text>
                                        )}
                                    </View>
                                    {enriched.engineIcon && !enriched.cover && !(enriched.images && enriched.images.length > 0) && !(project.imageUrls && project.imageUrls.length > 0) && (
                                        <Image
                                            source={enriched.engineIcon}
                                            style={styles.engineIcon}
                                            resizeMode="contain"
                                        />
                                    )}
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    );
                })}

                {/* Other categories */}
                {!isGameDev && (() => {
                    if (!loading && filteredProjects.length === 0) {
                        return (
                            <GlassCard style={styles.projectCard} intensity={20}>
                                <Text style={styles.projectName}>Coming Soon...</Text>
                                <Text style={styles.projectDesc}>I'll be adding my {filterCat} works here very soon.</Text>
                            </GlassCard>
                        );
                    }

                    return filteredProjects.map((project) => {
                        const enriched = enrichProject(project);
                        return (
                            <TouchableOpacity
                                key={project.id}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('GameDetail', { game: enriched })}
                            >
                                <GlassCard style={styles.projectCard} intensity={20}>
                                    <Text style={styles.projectName}>{project.title}</Text>
                                    <Text style={styles.projectDesc}>{project.description}</Text>
                                    <View style={styles.cardFooter}>
                                        <Text style={styles.viewDetails}>View Details</Text>
                                        <ChevronRight color={colors.primary} size={16} />
                                    </View>
                                </GlassCard>
                            </TouchableOpacity>
                        );
                    });
                })()}

                <View style={{ height: 120 }} />
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
        marginBottom: 30,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        marginRight: 10,
        padding: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
    },

    // Game Dev Card
    gameCard: {
        padding: 18,
        marginBottom: 14,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    gameCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gameInfo: {
        flex: 1,
        marginRight: 16,
    },
    gameTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    gameEngine: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    gameStatus: {
        fontSize: 12,
        color: colors.textMuted,
    },
    engineIcon: {
        width: 44,
        height: 44,
        tintColor: colors.text,
        opacity: 0.8,
    },
    engineIconSmall: {
        width: 16,
        height: 16,
        tintColor: colors.primary,
        marginRight: 6,
    },
    engineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },

    // Standard project card
    projectCard: {
        padding: 20,
        marginBottom: 16,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    projectName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    projectDesc: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 22,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 14,
    },
    viewDetails: {
        color: colors.primary,
        fontWeight: '600',
        marginRight: 4,
    },
});
