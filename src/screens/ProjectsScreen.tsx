import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';

// ————— Game Dev Projeleri —————
const GAME_PROJECTS = [
    {
        id: 'g1',
        title: 'Abonetor',
        engine: 'Unity',
        engineIcon: require('../../assets/unity_icon.png'),
        platform: 'Mobile',
        status: 'Published',
        description: 'Bu proje fikir olarak ortaya konulmuş ancak geliştirme aşamasında sıfır noktasında bulunan bir oyundu.Mekanikleri tasarlanma aşamasındayken ekibe katıldım. Projenin geliştirme kısımını devaralarak çok hızlı bir şekilde bitirdim. Bitirmemizle birlikte bir çok yarışmaya girişimci ruhumuzla lisede başvurduk. Aynı zamanda yine bu proje ile Abbas Güçlü İle Büyük Oyun Yarışmasına katıldık. Bu yarışmada derece elde edemesek de televizyonda canlı yayın ve stres altında neler yapmalıyız gibi bir çok değerli deneyimler kazandım.',
        cover: null,
        youtubeId: '38uq5rJSv84', // Örnek ID, kendi videonun ID'siyle değiştirebilirsin
        images: [], // Buraya ek görsellerin require() hallerini ekleyebilirsin
        awards: [
            { title: 'Netmarble Game Jam & Incubation Program', event: 'Incube Programında Barış Özistek gibi değerli insanlardan pazarlama ve geliştirme konusunda çok değerli eğitimler aldık. Bu programı 2.likle bitirdik. Çok değerli ödüller aldık.', rank: '2st Place', rankColor: '#ffffffff' },
        ],
    }, {
        id: 'g2',
        title: 'VR Elements',
        engine: 'Unity',
        engineIcon: require('../../assets/unity_icon.png'),
        platform: 'VR, PC',
        status: 'Game Jam',
        description: 'yapmalıyız gibi bir çok değerli deneyimler kazandım.',
        cover: null,
        youtubeId: '38uq5rJSv84', // Örnek ID, kendi videonun ID'siyle değiştirebilirsin
        images: [], // Buraya ek görsellerin require() hallerini ekleyebilirsin
        awards: [
            { title: 'Netmarble Game Jam & Incubation Program', event: 'Incube Programında Barış Özistek gibi değerli insanlardan pazarlama ve geliştirme konusunda çok değerli eğitimler aldık. Bu programı 2.likle bitirdik. Çok değerli ödüller aldık.', rank: '2st Place', rankColor: '#ffffffff' },
        ],
    },

];

// ————— Diğer Kategoriler (Örnek) —————
const OTHER_PROJECTS = [
    {
        id: 'o1',
        title: 'Focus Hub',
        category: 'Mobile App',
        description: 'React Native productivity app with gamified tasks and habit tracking.',
    },
    {
        id: 'o2',
        title: 'Mech-01 Protocol',
        category: '3D Art',
        description: 'High-poly hard surface modeling of a combat mech. Modeled in Blender, textured in Substance.',
    },
    {
        id: 'o3',
        title: 'The Lost Echoes',
        category: 'Writing / Lore',
        description: 'Interactive sci-fi fiction focusing on branching narratives and worldbuilding mechanics.',
    },
];

export const ProjectsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const filterCat = route.params?.filter || null;

    const isGameDev = filterCat === 'Game Dev';

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

                {/* ——— GAME DEV: Özel Liste ——— */}
                {isGameDev && GAME_PROJECTS.map((game) => (
                    <TouchableOpacity
                        key={game.id}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('GameDetail', { game })}
                    >
                        <GlassCard style={styles.gameCard} intensity={20}>
                            <View style={styles.gameCardContent}>
                                <View style={styles.gameInfo}>
                                    <Text style={styles.gameTitle}>{game.title}</Text>
                                    <Text style={styles.gameEngine}>{game.engine}</Text>
                                    <Text style={styles.gameStatus}>{game.status}</Text>
                                </View>
                                <Image
                                    source={game.engineIcon}
                                    style={styles.engineIcon}
                                    resizeMode="contain"
                                />
                            </View>
                        </GlassCard>
                    </TouchableOpacity>
                ))}

                {/* ——— DİĞER KATEGORİLER: Standart Liste ——— */}
                {!isGameDev && (() => {
                    const filtered = filterCat
                        ? OTHER_PROJECTS.filter(p => p.category === filterCat)
                        : OTHER_PROJECTS;

                    if (filtered.length === 0) {
                        return (
                            <GlassCard style={styles.projectCard} intensity={20}>
                                <Text style={styles.projectName}>Coming Soon...</Text>
                                <Text style={styles.projectDesc}>I'll be adding my {filterCat} works here very soon.</Text>
                            </GlassCard>
                        );
                    }

                    return filtered.map((project) => (
                        <TouchableOpacity key={project.id} activeOpacity={0.8}>
                            <GlassCard style={styles.projectCard} intensity={20}>
                                <Text style={styles.projectName}>{project.title}</Text>
                                <Text style={styles.projectDesc}>{project.description}</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.viewDetails}>View Details</Text>
                                    <ChevronRight color={colors.primary} size={16} />
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    ));
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
