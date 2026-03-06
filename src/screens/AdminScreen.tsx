import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Alert, Platform, Modal, Pressable, ActivityIndicator, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Plus, Trash2, Edit3, LogOut, Save, X, Upload } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { AbstractBackground } from '../components/AbstractBackground';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import {
    collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Project {
    id?: string;
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

const CATEGORIES = ['Game Dev', 'Mobile App', '3D Art', 'Writing / Lore'];

const EMPTY_PROJECT: Project = {
    title: '',
    category: 'Game Dev',
    description: '',
    status: '',
    platform: '',
    engine: '',
    youtubeId: '',
    coverUrl: '',
    imageUrls: [],
};

export const AdminScreen = () => {
    const navigation = useNavigation<any>();
    const { user, isAdmin, signInWithGoogle, logout } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<Project>(EMPTY_PROJECT);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const coverInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isAdmin) {
            fetchProjects();
        }
    }, [isAdmin]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Project[];
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
        setLoading(false);
    };

    const openAddModal = () => {
        setEditingProject(null);
        setFormData({ ...EMPTY_PROJECT, order: projects.length });
        setNewImageUrl('');
        setModalVisible(true);
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData({ ...project, imageUrls: project.imageUrls || [] });
        setNewImageUrl('');
        setModalVisible(true);
    };

    const addImageUrl = () => {
        if (!newImageUrl.trim()) return;
        setFormData({
            ...formData,
            imageUrls: [...(formData.imageUrls || []), newImageUrl.trim()]
        });
        setNewImageUrl('');
    };

    const removeImageUrl = (index: number) => {
        const updated = [...(formData.imageUrls || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, imageUrls: updated });
    };

    const uploadImageFile = async (file: File, type: 'gallery' | 'cover') => {
        setUploading(true);
        try {
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const storageRef = ref(storage, `projects/${timestamp}_${safeName}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);

            if (type === 'cover') {
                setFormData(prev => ({ ...prev, coverUrl: downloadUrl }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    imageUrls: [...(prev.imageUrls || []), downloadUrl]
                }));
            }
        } catch (error) {
            console.error('Upload error:', error);
            if (Platform.OS === 'web') {
                window.alert('Yukleme hatasi: ' + error);
            }
        }
        setUploading(false);
    };

    const pickGalleryImage = () => {
        if (Platform.OS === 'web' && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const pickCoverImage = () => {
        if (Platform.OS === 'web' && coverInputRef.current) {
            coverInputRef.current.click();
        }
    };

    const saveProject = async () => {
        if (!formData.title.trim()) {
            if (Platform.OS === 'web') {
                window.alert('Proje basligi bos olamaz!');
            } else {
                Alert.alert('Hata', 'Proje basligi bos olamaz!');
            }
            return;
        }

        try {
            const saveData = { ...formData };
            // Clean empty optional fields
            if (!saveData.coverUrl) delete saveData.coverUrl;
            if (!saveData.imageUrls || saveData.imageUrls.length === 0) delete saveData.imageUrls;
            if (!saveData.engine) delete saveData.engine;
            if (!saveData.youtubeId) delete saveData.youtubeId;

            if (editingProject?.id) {
                const docRef = doc(db, 'projects', editingProject.id);
                const { id, ...updateData } = saveData;
                await updateDoc(docRef, updateData);
            } else {
                await addDoc(collection(db, 'projects'), saveData);
            }
            setModalVisible(false);
            fetchProjects();
        } catch (error) {
            console.error('Save error:', error);
            if (Platform.OS === 'web') {
                window.alert('Kaydetme hatasi: ' + error);
            } else {
                Alert.alert('Hata', 'Kaydederken bir hata olustu.');
            }
        }
    };

    const deleteProject = async (projectId: string) => {
        const doDelete = async () => {
            try {
                await deleteDoc(doc(db, 'projects', projectId));
                fetchProjects();
            } catch (error) {
                console.error('Delete error:', error);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Bu projeyi silmek istediginizden emin misiniz?')) {
                doDelete();
            }
        } else {
            Alert.alert('Silme Onayi', 'Bu projeyi silmek istediginizden emin misiniz?', [
                { text: 'Iptal', style: 'cancel' },
                { text: 'Sil', style: 'destructive', onPress: doDelete },
            ]);
        }
    };

    // --- LOGIN SCREEN ---
    if (!user) {
        return (
            <View style={styles.container}>
                <AbstractBackground />
                <View style={styles.loginContainer}>
                    <GlassCard style={styles.loginCard} intensity={25}>
                        <Text style={styles.loginTitle}>Admin Panel</Text>
                        <Text style={styles.loginSubtitle}>
                            Devam etmek icin Google hesabinizla giris yapin
                        </Text>
                        <TouchableOpacity style={styles.googleBtn} onPress={signInWithGoogle} activeOpacity={0.8}>
                            <Text style={styles.googleBtnText}>Google ile Giris Yap</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backLink}
                            onPress={() => navigation.navigate('MainTabs')}
                        >
                            <Text style={styles.backLinkText}>Ana Sayfaya Don</Text>
                        </TouchableOpacity>
                    </GlassCard>
                </View>
            </View>
        );
    }

    // --- NOT ADMIN ---
    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <AbstractBackground />
                <View style={styles.loginContainer}>
                    <GlassCard style={styles.loginCard} intensity={25}>
                        <Text style={styles.loginTitle}>Yetkisiz Erisim</Text>
                        <Text style={styles.loginSubtitle}>
                            Bu hesap ({user.email}) admin yetkisine sahip degil.
                        </Text>
                        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
                            <Text style={styles.logoutBtnText}>Cikis Yap</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backLink}
                            onPress={() => navigation.navigate('MainTabs')}
                        >
                            <Text style={styles.backLinkText}>Ana Sayfaya Don</Text>
                        </TouchableOpacity>
                    </GlassCard>
                </View>
            </View>
        );
    }

    // --- ADMIN PANEL ---
    return (
        <View style={styles.container}>
            <AbstractBackground />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.backBtn} activeOpacity={0.7}>
                        <ChevronLeft color={colors.text} size={32} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Admin Panel</Text>
                        <Text style={styles.subtitle}>{user.email}</Text>
                    </View>
                    <TouchableOpacity onPress={logout} style={styles.logoutIconBtn} activeOpacity={0.7}>
                        <LogOut color={colors.textMuted} size={22} />
                    </TouchableOpacity>
                </View>

                {/* Add Project Button */}
                <TouchableOpacity style={styles.addBtn} onPress={openAddModal} activeOpacity={0.8}>
                    <Plus color="#fff" size={20} />
                    <Text style={styles.addBtnText}>Yeni Proje Ekle</Text>
                </TouchableOpacity>

                {/* Loading */}
                {loading && (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}

                {/* Project List */}
                {projects.map((project) => (
                    <GlassCard key={project.id} style={styles.projectCard} intensity={20}>
                        <View style={styles.projectRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.projectTitle}>{project.title}</Text>
                                <Text style={styles.projectCategory}>{project.category}</Text>
                                {project.status && (
                                    <Text style={styles.projectStatus}>{project.status}</Text>
                                )}
                                {project.imageUrls && project.imageUrls.length > 0 && (
                                    <Text style={styles.imageCount}>
                                        {project.imageUrls.length} gorsel
                                    </Text>
                                )}
                            </View>
                            <View style={styles.actionBtns}>
                                <TouchableOpacity
                                    style={styles.editBtn}
                                    onPress={() => openEditModal(project)}
                                    activeOpacity={0.7}
                                >
                                    <Edit3 color="#ccc" size={18} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => project.id && deleteProject(project.id)}
                                    activeOpacity={0.7}
                                >
                                    <Trash2 color="#888" size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </GlassCard>
                ))}

                {!loading && projects.length === 0 && (
                    <GlassCard style={styles.emptyCard} intensity={20}>
                        <Text style={styles.emptyText}>Henuz proje eklenmedi.</Text>
                        <Text style={styles.emptySubText}>Yukaridaki butona tiklayarak ilk projenizi ekleyin.</Text>
                    </GlassCard>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Add/Edit Modal */}
            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalBg} onPress={() => setModalVisible(false)} />
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {editingProject ? 'Projeyi Duzenle' : 'Yeni Proje'}
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <X color={colors.text} size={24} />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Baslik *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.title}
                                onChangeText={(t) => setFormData({ ...formData, title: t })}
                                placeholder="Proje adi"
                                placeholderTextColor="#555"
                            />

                            <Text style={styles.label}>Kategori</Text>
                            <View style={styles.categoryRow}>
                                {CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.categoryChip,
                                            formData.category === cat && styles.categoryChipActive,
                                        ]}
                                        onPress={() => setFormData({ ...formData, category: cat })}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryChipText,
                                                formData.category === cat && styles.categoryChipTextActive,
                                            ]}
                                        >
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.label}>Aciklama</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.description}
                                onChangeText={(t) => setFormData({ ...formData, description: t })}
                                placeholder="Proje aciklamasi"
                                placeholderTextColor="#555"
                                multiline
                                numberOfLines={4}
                            />

                            <Text style={styles.label}>Motor (opsiyonel)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.engine}
                                onChangeText={(t) => setFormData({ ...formData, engine: t })}
                                placeholder="Unity, Unreal Engine, vb."
                                placeholderTextColor="#555"
                            />

                            <Text style={styles.label}>Platform</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.platform}
                                onChangeText={(t) => setFormData({ ...formData, platform: t })}
                                placeholder="Mobile, PC, VR, iOS, vb."
                                placeholderTextColor="#555"
                            />

                            <Text style={styles.label}>Durum</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.status}
                                onChangeText={(t) => setFormData({ ...formData, status: t })}
                                placeholder="Published, Game Jam, Student Project, vb."
                                placeholderTextColor="#555"
                            />

                            <Text style={styles.label}>YouTube Video ID (opsiyonel)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.youtubeId}
                                onChangeText={(t) => setFormData({ ...formData, youtubeId: t })}
                                placeholder="Orn: 38uq5rJSv84"
                                placeholderTextColor="#555"
                            />

                            <Text style={styles.label}>Kapak Gorseli</Text>
                            <View style={styles.addImageRow}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.coverUrl}
                                        onChangeText={(t) => setFormData({ ...formData, coverUrl: t })}
                                        placeholder="URL yapistir veya dosya yukle"
                                        placeholderTextColor="#555"
                                    />
                                </View>
                                <TouchableOpacity style={styles.addImageBtn} onPress={pickCoverImage} activeOpacity={0.7}>
                                    <Upload color="#fff" size={18} />
                                </TouchableOpacity>
                            </View>
                            {formData.coverUrl ? (
                                <Image
                                    source={{ uri: formData.coverUrl }}
                                    style={styles.previewImage}
                                    resizeMode="cover"
                                />
                            ) : null}

                            {/* Hidden file inputs for web */}
                            {Platform.OS === 'web' && (
                                <View style={{ height: 0, overflow: 'hidden' }}>
                                    <input
                                        ref={coverInputRef as any}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e: any) => {
                                            const file = e.target?.files?.[0];
                                            if (file) uploadImageFile(file, 'cover');
                                            e.target.value = '';
                                        }}
                                    />
                                    <input
                                        ref={fileInputRef as any}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e: any) => {
                                            const file = e.target?.files?.[0];
                                            if (file) uploadImageFile(file, 'gallery');
                                            e.target.value = '';
                                        }}
                                    />
                                </View>
                            )}

                            {/* Image URLs Section */}
                            <Text style={styles.label}>Galeri Gorselleri</Text>
                            {uploading && (
                                <View style={{ padding: 12, alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color="#fff" />
                                    <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Yukleniyor...</Text>
                                </View>
                            )}
                            {(formData.imageUrls || []).map((url, index) => (
                                <View key={index} style={styles.imageUrlRow}>
                                    <Image
                                        source={{ uri: url }}
                                        style={styles.imageThumb}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.imageUrlText} numberOfLines={1}>{url}</Text>
                                    <TouchableOpacity onPress={() => removeImageUrl(index)} style={styles.removeImageBtn}>
                                        <X color="#888" size={16} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <View style={styles.addImageRow}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <TextInput
                                        style={styles.input}
                                        value={newImageUrl}
                                        onChangeText={setNewImageUrl}
                                        placeholder="URL yapistir"
                                        placeholderTextColor="#555"
                                        onSubmitEditing={addImageUrl}
                                    />
                                </View>
                                <TouchableOpacity style={styles.addImageBtn} onPress={addImageUrl} activeOpacity={0.7}>
                                    <Plus color="#fff" size={18} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.addImageBtn, { marginLeft: 8 }]} onPress={pickGalleryImage} activeOpacity={0.7}>
                                    <Upload color="#fff" size={18} />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Siralama (order)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(formData.order ?? 0)}
                                onChangeText={(t) => setFormData({ ...formData, order: parseInt(t) || 0 })}
                                placeholder="0"
                                placeholderTextColor="#555"
                                keyboardType="numeric"
                            />

                            <TouchableOpacity style={styles.saveBtn} onPress={saveProject} activeOpacity={0.8}>
                                <Save color="#fff" size={18} />
                                <Text style={styles.saveBtnText}>
                                    {editingProject ? 'Guncelle' : 'Kaydet'}
                                </Text>
                            </TouchableOpacity>

                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
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
        color: '#fff',
    },
    subtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    logoutIconBtn: {
        padding: 8,
    },

    // Login
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginCard: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        maxWidth: 400,
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 12,
    },
    loginSubtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    googleBtn: {
        backgroundColor: '#222',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    googleBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    logoutBtn: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    logoutBtnText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: '700',
    },
    backLink: {
        marginTop: 20,
    },
    backLinkText: {
        color: '#888',
        fontSize: 14,
    },

    // Add button
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#444',
    },
    addBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },

    // Project card
    projectCard: {
        padding: 16,
        marginBottom: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    projectRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
    },
    projectCategory: {
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
    },
    projectStatus: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    imageCount: {
        fontSize: 11,
        color: '#555',
        marginTop: 2,
    },
    actionBtns: {
        flexDirection: 'row',
        gap: 12,
    },
    editBtn: {
        padding: 8,
    },
    deleteBtn: {
        padding: 8,
    },

    // Empty state
    emptyCard: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    modalContent: {
        backgroundColor: '#111',
        borderRadius: 20,
        padding: 24,
        width: '90%',
        maxWidth: 500,
        maxHeight: '85%',
        borderWidth: 1,
        borderColor: '#333',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
        marginBottom: 6,
        marginTop: 14,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        color: '#fff',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    categoryRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    categoryChipActive: {
        borderColor: '#fff',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    categoryChipText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    categoryChipTextActive: {
        color: '#fff',
    },

    // Image fields
    previewImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginTop: 8,
        backgroundColor: '#1a1a1a',
    },
    imageUrlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 10,
        padding: 8,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#222',
    },
    imageThumb: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#1a1a1a',
        marginRight: 10,
    },
    imageUrlText: {
        flex: 1,
        fontSize: 12,
        color: '#777',
    },
    removeImageBtn: {
        padding: 6,
    },
    addImageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    addImageBtn: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#444',
    },

    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#444',
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
});
