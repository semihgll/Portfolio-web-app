import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Dimensions, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CERTIFICATES = [
    {
        id: 1,
        title: 'Bahçeşehir University Move Up',
        issuer: 'Bir günde geleceğine yön ver!',
        date: '2020',
        description: 'Yapay Zeka, Modelleme, Dijital İletişimde Yaratıcılık gibi konulardan gerçekten çok önemli bilgiler öğrendiğim bir eğitimdi özellikle Şafak Şahin Bey yaratıcılık konusunda önemli bilgiler verdi.',
        image: require('../../assets/sertifika_MoveUp.png'),
    },
];



const EVENTS = [
    {
        id: 1,
        title: 'Global Bodjam',
        organizer: 'Muğla Sıtkı Koçman Üniversitesi',
        date: '2023',
        duration: '48 hours',
        description: 'Elimizden gelenin en iyisini takım olarak yapmaya çalıştık.',
    },
    {
        id: 2,
        title: 'Global Game Jam',
        organizer: 'İzmir Ekonomi Üniversitesi',
        date: '2020',
        duration: '48 hours',
        description: 'Çok eğlendiğim bir etkinlikti. Zamana karşı verdiğimiz mücadele bana çok fazla deneyim kattı.',
    },
    {
        id: 3,
        title: 'ITU Dijifikir Yarışması & Bilişim Teknolojileri Zirvesi',
        organizer: 'İTÜ',
        date: '2019',
        description: 'Bu etkinlikte hem yarışmaya katıldım hem de zirveye katılarak çok önemli bilgiler edindim.',
    },
    {
        id: 4,
        title: 'Dokuz Eylül Game Jam',
        organizer: 'Dokuz Eylül Üniversitesi',
        date: '2018',
        description: 'Bu projede VR ve eğitim odaklı ilerledim. Geliştirici olarak yer aldım projede. Güzel bir etkinlikti.',
    },
];

export const CertificatesScreen = () => {
    const [selectedCert, setSelectedCert] = useState<any>(null);

    return (
        <View style={styles.container}>
            <AbstractBackground />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <Text style={styles.title}>Achievements</Text>
                    <Text style={styles.subtitle}>Certificates, competitions & awards</Text>
                </View>

                {/* Section: Sertifikalar */}
                <Text style={styles.sectionLabel}>Certificates</Text>

                {CERTIFICATES.map((cert) => (
                    <TouchableOpacity key={cert.id} activeOpacity={0.8} onPress={() => setSelectedCert(cert)}>
                        <GlassCard style={styles.certCard} intensity={20}>
                            <Text style={styles.certTitle}>{cert.title}</Text>
                            <View style={styles.certMeta}>
                                <Text style={styles.certIssuer}>{cert.issuer}</Text>
                                <Text style={styles.certDate}>{cert.date}</Text>
                            </View>
                            <Text style={styles.certDesc}>{cert.description}</Text>
                            <View style={styles.tapHint}>
                                <Text style={styles.tapHintText}>Tap to view certificate</Text>
                            </View>
                        </GlassCard>
                    </TouchableOpacity>
                ))}



                {/* Section: Etkinlikler */}
                <Text style={styles.sectionLabel}>Events</Text>

                {EVENTS.map((event) => (
                    <GlassCard key={event.id} style={styles.certCard} intensity={20}>
                        <Text style={styles.certTitle}>{event.title}</Text>
                        <View style={styles.certMeta}>
                            <Text style={styles.certIssuer}>{event.organizer}</Text>
                            <Text style={styles.certDate}>{event.date}</Text>
                        </View>
                        <Text style={styles.certDesc}>{event.description}</Text>
                    </GlassCard>
                ))}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Certificate Modal Popup */}
            <Modal
                visible={selectedCert !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedCert(null)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setSelectedCert(null)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>

                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedCert(null)}>
                            <Text style={styles.closeBtnText}>✕</Text>
                        </TouchableOpacity>

                        {/* Certificate Title */}
                        <Text style={styles.modalTitle}>{selectedCert?.title}</Text>
                        <Text style={styles.modalIssuer}>{selectedCert?.issuer} • {selectedCert?.date}</Text>

                        {/* Certificate Image */}
                        {selectedCert?.image ? (
                            <Image
                                source={selectedCert.image}
                                style={styles.certImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Text style={styles.placeholderText}>Eksik var!</Text>
                                <Text style={styles.placeholderSubText}>
                                    Sertifika görselini assets klasörüne ekle
                                </Text>
                            </View>
                        )}

                        {/* Description */}
                        <Text style={styles.modalDesc}>{selectedCert?.description}</Text>

                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 30,
        marginTop: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
    },
    certCard: {
        padding: 20,
        marginBottom: 16,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    certTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 10,
    },
    certMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    certIssuer: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    certDate: {
        fontSize: 13,
        color: colors.textMuted,
    },
    certDesc: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 22,
    },
    tapHint: {
        marginTop: 14,
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    tapHintText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '600',
    },

    // Section & Competition Styles
    sectionLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
        marginTop: 10,
    },
    compHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    rankBadge: {
        fontSize: 14,
        fontWeight: '800',
    },
    durationBadge: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        overflow: 'hidden',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#111',
        borderRadius: 20,
        padding: 24,
        width: SCREEN_WIDTH * 0.9,
        maxHeight: SCREEN_HEIGHT * 0.85,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    closeBtn: {
        position: 'absolute',
        top: 12,
        right: 16,
        zIndex: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtnText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 6,
        paddingRight: 36,
    },
    modalIssuer: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
        marginBottom: 20,
    },
    certImage: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.45,
        borderRadius: 12,
        marginBottom: 16,
    },
    placeholderImage: {
        width: '100%',
        height: 200,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderStyle: 'dashed',
    },
    placeholderText: {
        fontSize: 48,
        marginBottom: 8,
    },
    placeholderSubText: {
        color: colors.textMuted,
        fontSize: 13,
    },
    modalDesc: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 22,
    },
});
