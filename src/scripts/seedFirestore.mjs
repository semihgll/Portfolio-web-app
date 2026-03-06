/**
 * Firestore Seed Script
 * Mevcut hardcoded projeleri Firestore'a yükler.
 * 
 * Çalıştırmak için:
 *   node src/scripts/seedFirestore.mjs
 * 
 * NOT: Bu script sadece bir kere çalıştırılmalıdır.
 * NOT: Görseller (images, cover, engineIcon) Firestore'a yüklenemez.
 *       Bunlar require() ile local olarak kalacak.
 *       Sadece metin tabanlı alanlar Firestore'a yüklenir.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDweYJTBwwxyszjNkmsB4UZjRfqgc-kduM",
    authDomain: "portfolio-sgl.firebaseapp.com",
    projectId: "portfolio-sgl",
    storageBucket: "portfolio-sgl.firebasestorage.app",
    messagingSenderId: "819568013109",
    appId: "1:819568013109:web:dda5f2bdf58c76fbdba67c",
    measurementId: "G-Y0RJLF5C9Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PROJECTS = [
    {
        title: 'Abonetor',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'Mobile',
        status: 'Published',
        description: 'Bu proje fikir olarak ortaya konulmuş ancak geliştirme aşamasında sıfır noktasında bulunan bir oyundu. Mekanikleri tasarlanma aşamasındayken ekibe katıldım. Projenin geliştirme kısımını devaralarak çok hızlı bir şekilde bitirdim. Bitirmemizle birlikte bir çok yarışmaya girişimci ruhumuzla lisede başvurduk. Aynı zamanda yine bu proje ile Abbas Güçlü İle Büyük Oyun Yarışmasına katıldık. Bu yarışmada derece elde edemesek de televizyonda canlı yayın ve stres altında neler yapmalıyız gibi bir çok değerli deneyimler kazandım.',
        youtubeId: '38uq5rJSv84',
        order: 0,
    },
    {
        title: 'VR Elements',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'VR, PC',
        status: 'Game Jam Game',
        description: 'Bu proje bir game jam projesi ve VR olarak game jam oyunu geliştirmek zor bir tercihdi. Lisede olmam bu konuda heyecanlı olmam sayesinde bu projeyi ekipçe çıkarabildik.',
        youtubeId: 'XnAu-dD7-dg?si=gOp7bKwqrWc5xJCZ',
        order: 1,
    },
    {
        title: 'Cymatics Puzzle!',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'Mobile App Store',
        status: 'Expired',
        description: 'Bu projede kendimi geliştirmek için daha farklı alanlara yöneldim. 2D piksellerden oluşturulmuş bir görseli Unity içinde okutarak her pikselin dünya üzerinde bir noktaya gelmesini sağladım.',
        youtubeId: 'hZ9DVCq2h3Y',
        order: 2,
    },
    {
        title: 'Math Pong',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'Mobile App Store',
        status: 'Expired',
        description: 'Bu projede developer olarak görev aldım. Fizik ile hatalı oluşabilecek her işlemi matematik ile önceden planlayarak o dönemde popüler olan bir oyunun mobil versiyonunu geliştirdim.',
        youtubeId: 'mAMcvhiDTlc',
        order: 3,
    },
    {
        title: 'Astroneer',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'PC',
        status: 'Game Jam Game',
        description: 'Bu projede developer olarak görev aldım. Dijital tasarımı bölümünde okurken katıldığım ilk game jam projesi. Kazma mekanikleri harici tüm mekanikleri ben geliştirdim.',
        order: 4,
    },
    {
        title: 'Whisper Woods',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'PC',
        status: 'Student Project',
        description: 'Bu projede developer, texture artist, foliage designer, environment artist ve tester olarak görev aldım.',
        order: 5,
    },
    {
        title: 'Empire Conquest',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'PC',
        status: 'Game Jam Game',
        description: 'Bu projede developer, level design ve game design rollerinde görev aldım.',
        order: 6,
    },
    {
        title: 'Forgotten Inventions',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'PC',
        status: 'Student Project',
        description: 'Bu projede developer ve animator rollerinde görev aldım.',
        order: 7,
    },
    {
        title: 'Pandoras Redemption',
        category: 'Game Dev',
        engine: 'Unreal Engine',
        platform: 'PC',
        status: 'Solo Student Project',
        description: 'Bu projedeki tüm geliştirmeler ve tasarımlar tamamen bana ait. Şu anda geliştirme aşamasında görselleri yüklenecektir.',
        order: 8,
    },
    {
        title: 'Lingua',
        category: 'Mobile App',
        description: 'React Native ve expo kullanarak geliştirdiğim bir dil öğrenme uygulaması.',
        status: 'Staj Projesi',
        platform: 'IOS',
        youtubeId: 'b9PZwSgQXBI',
        order: 9,
    },
    {
        title: 'Ikarus Sculpture',
        category: '3D Art',
        description: 'Bu benim bitirme oyunu için yaptığım çevre elementlerinden birisi. İkarusun düşmeye hemen başlamadan önceki halini Blender ile sculpt yaptım ve Substance Painter ile kaplamasını yaptım.',
        status: 'Bitirme Projesi',
        platform: 'Blender & Substance Painter',
        order: 10,
    },
];

async function seed() {
    console.log('Seeding Firestore...');
    for (const project of PROJECTS) {
        try {
            const docRef = await addDoc(collection(db, 'projects'), project);
            console.log(`✅ ${project.title} -> ${docRef.id}`);
        } catch (error) {
            console.error(`❌ ${project.title}:`, error);
        }
    }
    console.log('\nDone! Tüm projeler Firestore\'a yüklendi.');
    process.exit(0);
}

seed();
