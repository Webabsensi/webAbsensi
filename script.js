// Inisialisasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyChE-rVOFAzceI9PGr8KrB2I094UTC3QPo",
    authDomain: "webabsensi-a707f.firebaseapp.com",
    projectId: "webabsensi-a707f",
    storageBucket: "webabsensi-a707f.appspot.com",
    messagingSenderId: "466120916658",
    appId: "1:466120916658:web:6e1c01e3b62ad98bbd93ab",
    measurementId: "G-RSELYCHW99"
};

// Inisialisasi aplikasi Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Fungsi untuk menampilkan konten sesuai dengan menu yang diklik
function showContent(sectionId) {
    // Sembunyikan semua konten
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none');
    
    // Tampilkan konten yang sesuai dengan ID
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    } else {
        console.error('Section dengan ID', sectionId, 'tidak ditemukan.');
    }
}

// Fungsi untuk menyimpan absensi
function simpanAbsensi(event) {
    event.preventDefault();
    const namaKaryawan = document.getElementById('nama-absensi').value;
    const kehadiran = document.querySelector('input[name="kehadiran"]:checked').value;
    
    let keterangan = '';
    if (kehadiran === 'Hadir') {
        keterangan = document.querySelector('input[name="keterangan-hadir"]:checked').value;
    } else if (kehadiran === 'Tidak Hadir') {
        keterangan = document.querySelector('input[name="keterangan-tidak-hadir"]:checked').value;
    }

    alert(`Absensi disimpan!\nNama: ${namaKaryawan}\nKehadiran: ${kehadiran}\nKeterangan: ${keterangan}`);
}

// Fungsi untuk menambah karyawan
function tambahKaryawan(event) {
    event.preventDefault();
    const nama = document.getElementById('nama').value;

    // Menyimpan data ke Firebase Realtime Database
    const karyawanRef = database.ref('karyawan').push();
    karyawanRef.set({
        nama: nama
    })
    .then(() => {
        alert(`Karyawan ${nama} telah ditambahkan.`);
        
        // Tambahkan nama karyawan ke daftar di halaman
        const list = document.getElementById('nama-karyawan-list');
        const listItem = document.createElement('li');
        listItem.textContent = nama;
        list.appendChild(listItem);
    })
    .catch(error => {
        console.error('Error menambahkan karyawan: ', error);
    });

    // Kosongkan input setelah menambah karyawan
    document.getElementById('nama').value = '';
}

// Fungsi untuk melihat laporan (ini hanya placeholder)
function lihatLaporan(event) {
    event.preventDefault();
    const tanggal = document.getElementById('tanggal').value;
    alert(`Menampilkan laporan untuk tanggal: ${tanggal}`);
}

// Fungsi untuk menampilkan atau menyembunyikan keterangan absensi
function toggleKeterangan(kehadiran) {
    const keteranganHadir = document.getElementById('keterangan-hadir');
    const keteranganTidakHadir = document.getElementById('keterangan-tidak-hadir');

    if (kehadiran === 'hadir') {
        keteranganHadir.style.display = 'block';
        keteranganTidakHadir.style.display = 'none';
    } else if (kehadiran === 'tidak-hadir') {
        keteranganHadir.style.display = 'none';
        keteranganTidakHadir.style.display = 'block';
    }
}

// Tampilkan menu utama secara default saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    showContent('menu-utama');
});
