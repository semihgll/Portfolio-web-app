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
        status: 'Game Jam Game',
        description: 'Bu proje bir game jam projesi ve VR olarak game jam oyunu geliştirmek zor bir tercihdi. Lisede olmam bu konuda heyecanlı olmam sayesinde bu projeyi ekipçe çıkarabildik.',
        cover: null,
        youtubeId: 'XnAu-dD7-dg?si=gOp7bKwqrWc5xJCZ', // Örnek ID, kendi videonun ID'siyle değiştirebilirsin
        images: [], // Buraya ek görsellerin require() hallerini ekleyebilirsin

    },
    {
        id: 'g3',
        title: 'Cymatics Puzzle!',
        engine: 'Mobile',
        engineIcon: require('../../assets/unity_icon.png'),
        platform: 'Mobile App Store',
        status: 'Expired',
        description: 'Bu projede kendimi geliştirmek için daha farklı alanlara yöneldim. 2D piksellerden oluşturulmuş bir görseli Unity içinde okutarak her pikselin dünya üzerinde bir noktaya gelmesini sağladım. Daha sonrasında doğru konumları hafızada tutup random şekilde hareket etmelerini sağladım her bir taneciğin. Önümüzdeki leverlar ile kumların frekanslarını değiştirip doğru konumlarına gelmelerini sağlayan bir sistem yazdım. Bu sistemlerin bir araya gelmesiyle de cymatics fenomeninin simüle edilmesini sağladım.Bu proje daha benim dijital oyun tasarımı bölümüne başlamadan geliştirdiğim projelerden biri.',
        cover: null,
        youtubeId: 'hZ9DVCq2h3Y', // Örnek ID, kendi videonun ID'siyle değiştirebilirsin
        images: [], // Buraya ek görsellerin require() hallerini ekleyebilirsin

    },
    {
        id: 'g4',
        title: 'Math Pong',
        engine: 'Unity',
        engineIcon: require('../../assets/unity_icon.png'),
        platform: 'Mobile App Store',
        status: 'Expired',
        description: 'Bu projede developer olarak görev aldım. Fizik ile hatalı oluşabilecek her işlemi matematik ile önceden planlayarak o dönemde popüler olan bir oyunun mobil versiyonunu geliştirdim. Bu proje daha benim dijital oyun tasarımı bölümüne başlamadan geliştirdiğim projelerden biri.',
        youtubeId: 'mAMcvhiDTlc', // Örnek ID, kendi videonun ID'siyle değiştirebilirsin
        images: [], // Buraya ek görsellerin require() hallerini ekleyebilirsin

    },
    {
        id: 'g5',
        title: 'Astroneer',
        engine: 'Unity',
        engineIcon: require('../../assets/unity_icon.png'),
        platform: 'PC',
        status: 'Game Jam Game',
        description: 'Bu projede developer olarak görev aldım. Dijital tasarımı bölümünde okurken katıldığım ilk game jam projesi. Diyalog sistemi tasarımı bölümünde okurken katıldığım ilk game jam projesi. Kazma mekanikleri harici tüm mekanikleri ben geliştirdim. ',
        images: [require('../../assets/astro_dialog.png'), require('../../assets/astro_env.png'), require('../../assets/astro_menu.png')],
    },
    {
        id: 'g6',
        title: 'Whisper Woods',
        engine: 'Unity',
        engineIcon: require('../../assets/unity_icon.png'),
        platform: 'PC',
        status: 'Student Project',
        description: 'Bu projede developer, texture artist, foliage designer, environment artist ve tester olarak görev aldım. ',
        images: [require('../../assets/ww_chase.png'), require('../../assets/ww_esc.png'), require('../../assets/ww_mm.png'), require('../../assets/ww_esc.png'), require('../../assets/ww_text.png')],
    },
    {
        id: 'g7',
        title: 'Empire Conquest',
        engine: 'Unity',
        engineIcon: require('../../assets/unity_icon.png'),
        platform: 'PC',
        status: 'Game Jam Game',
        description: 'Bu projede developer, level design ve game design rollerinde görev aldım. ',
        images: [require('../../assets/eq_win.png'), require('../../assets/eq_start.png'), require('../../assets/eq_mm.png'), require('../../assets/eq_gp.png'), require('../../assets/eq_game.png')],
    },
    {
        id: 'g8',
        title: 'Forgotten Inventions',
        engine: 'Unity',
        engineIcon: require('../../assets/unity_icon.png'),
        platform: 'PC',
        status: 'Student Project',
        description: 'Bu projede developer ve animator rollerinde görev aldım. ',
        cover: require('../../assets/fi_cover.jpg'),
        images: [require('../../assets/fi_gm.png'), require('../../assets/fi_gpz_.png'), require('../../assets/fi_bomb.png'), require('../../assets/fi_mm.png'), require('../../assets/fi_tt.png')],
    }
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
                            {(game.cover || (game.images && game.images.length > 0)) && (
                                <Image
                                    source={game.cover || game.images[0]}
                                    style={[styles.gamePreview, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
                                    resizeMode="contain"
                                />
                            )}
                            <View style={styles.gameCardContent}>
                                <View style={styles.gameInfo}>
                                    <Text style={styles.gameTitle}>{game.title}</Text>
                                    <View style={styles.engineRow}>
                                        {game.engineIcon && (
                                            <Image
                                                source={game.engineIcon}
                                                style={styles.engineIconSmall}
                                                resizeMode="contain"
                                            />
                                        )}
                                        <Text style={styles.gameEngine}>{game.engine}</Text>
                                    </View>
                                    <Text style={styles.gameStatus}>{game.status}</Text>
                                </View>
                                {!(game.cover || (game.images && game.images.length > 0)) && game.engineIcon && (
                                    <Image
                                        source={game.engineIcon}
                                        style={styles.engineIcon}
                                        resizeMode="contain"
                                    />
                                )}
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
    gamePreview: {
        width: '100%',
        height: 240,
        borderRadius: 12,
        marginBottom: 12,
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
