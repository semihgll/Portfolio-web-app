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

// Sadece eksik kalan 3 proje
const MISSING = [
    {
        title: 'Abonetor',
        category: 'Game Dev',
        engine: 'Unity',
        platform: 'Mobile',
        status: 'Published',
        description: 'Bu proje fikir olarak ortaya konulmuş ancak geliştirme aşamasında sıfır noktasında bulunan bir oyundu. Mekanikleri tasarlanma aşamasındayken ekibe katıldım. Projenin geliştirme kısımını devaralarak çok hızlı bir şekilde bitirdim.',
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
];

async function seed() {
    console.log('Eksik projeleri yüklüyor...');
    for (const project of MISSING) {
        try {
            const docRef = await addDoc(collection(db, 'projects'), project);
            console.log(`✅ ${project.title} -> ${docRef.id}`);
        } catch (error) {
            console.error(`❌ ${project.title}:`, error);
        }
    }
    console.log('\nDone!');
    process.exit(0);
}

seed();
