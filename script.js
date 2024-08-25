// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyChE-rVOFAzceI9PGr8KrB2I094UTC3QPo",
    authDomain: "webabsensi-a707f.firebaseapp.com",
    projectId: "webabsensi-a707f",
    storageBucket: "webabsensi-a707f.appspot.com",
    messagingSenderId: "466120916658",
    appId: "1:466120916658:web:6e1c01e3b62ad98bbd93ab",
    measurementId: "G-RSELYCHW99"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Fungsi untuk menampilkan konten sesuai dengan menu yang diklik
function showContent(sectionId) {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none');
    
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

    const absensiId = database.ref('absensi').push().key;
    const absensiData = {
        nama: namaKaryawan,
        kehadiran: kehadiran,
        keterangan: keterangan,
        tanggal: new Date().toISOString().split('T')[0] // Tanggal saat ini
    };

    database.ref('absensi/' + absensiId).set(absensiData)
        .then(() => {
            alert('Absensi berhasil disimpan!');
        })
        .catch(error => {
            console.error('Error menyimpan absensi:', error);
        });
}

// Fungsi untuk menambah karyawan
function tambahKaryawan(event) {
    event.preventDefault();

    const nama = document.getElementById('nama').value;
    const daftarKaryawanButton = document.getElementById('daftar-karyawan-button');

    daftarKaryawanButton.textContent = 'Loading...';

    const karyawanId = database.ref('karyawan').push().key;
    const karyawanData = {
        nama: nama
    };

    database.ref('karyawan/' + karyawanId).set(karyawanData)
        .then(() => {
            daftarKaryawanButton.textContent = 'Success';
            setTimeout(() => {
                daftarKaryawanButton.textContent = 'Daftar';
                document.getElementById('form-pendaftaran').reset();
            }, 2000);
        })
        .catch(error => {
            console.error('Error menambah karyawan:', error);
            daftarKaryawanButton.textContent = 'Daftar';
        });
}

// Fungsi untuk melihat laporan
function lihatLaporan(event) {
    event.preventDefault();

    const tanggal = document.getElementById('tanggal').value;
    const laporanList = document.getElementById('laporan-harian-list');

    laporanList.innerHTML = ''; // Clear existing list

    database.ref('absensi').orderByChild('tanggal').equalTo(tanggal).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const data = childSnapshot.val();
                    const listItem = document.createElement('li');
                    listItem.textContent = `Nama: ${data.nama}, Kehadiran: ${data.kehadiran}, Keterangan: ${data.keterangan}`;
                    laporanList.appendChild(listItem);
                });
            } else {
                laporanList.innerHTML = '<li>Tidak ada laporan untuk tanggal ini.</li>';
            }
        })
        .catch(error => {
            console.error('Error melihat laporan:', error);
        });
}

// Fungsi untuk menampilkan nama karyawan dari Firebase
function tampilkanNamaKaryawan() {
    const namaKaryawanList = document.getElementById('nama-karyawan-list');
    namaKaryawanList.innerHTML = ''; // Clear existing list

    database.ref('karyawan').once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const data = childSnapshot.val();
                    const listItem = document.createElement('li');
                    listItem.textContent = data.nama;
                    namaKaryawanList.appendChild(listItem);
                });
            } else {
                namaKaryawanList.innerHTML = '<li>Tidak ada nama karyawan.</li>';
            }
        })
        .catch(error => {
            console.error('Error menampilkan nama karyawan:', error);
        });
}

// Fungsi untuk menampilkan karyawan dan absensi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    showContent('menu-utama');
    tampilkanNamaKaryawan(); // Tampilkan nama karyawan saat halaman dimuat
});
