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

    const tanggal = new Date().toISOString().split('T')[0];

    // Simpan data ke Firebase
    database.ref('absensi/' + tanggal).push({
        nama: namaKaryawan,
        kehadiran: kehadiran,
        keterangan: keterangan
    });

    alert(`Absensi disimpan!\nNama: ${namaKaryawan}\nKehadiran: ${kehadiran}\nKeterangan: ${keterangan}`);
}

// Fungsi untuk menambah karyawan
function tambahKaryawan(event) {
    event.preventDefault();
    const nama = document.getElementById('nama').value;
    database.ref('karyawan/').push({
        nama: nama
    });

    updateNamaKaryawanList();
    alert(`Karyawan ${nama} telah ditambahkan.`);
}

// Fungsi untuk memperbarui daftar nama karyawan
function updateNamaKaryawanList() {
    const list = document.getElementById('nama-karyawan-list');
    const namaAbsensi = document.getElementById('nama-absensi');
    list.innerHTML = '';
    namaAbsensi.innerHTML = '';

    database.ref('karyawan/').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const karyawan = childSnapshot.val();
            const listItem = document.createElement('li');
            listItem.textContent = karyawan.nama;
            list.appendChild(listItem);

            const optionItem = document.createElement('option');
            optionItem.value = karyawan.nama;
            optionItem.textContent = karyawan.nama;
            namaAbsensi.appendChild(optionItem);
        });
    });
}

// Fungsi untuk melihat laporan (ini hanya placeholder)
function lihatLaporan(event) {
    event.preventDefault();
    const tanggal = document.getElementById('tanggal').value;

    // Ambil data dari Firebase dan tampilkan
    database.ref('absensi/' + tanggal).once('value', snapshot => {
        let laporan = `Laporan untuk tanggal: ${tanggal}\n\n`;
        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            laporan += `Nama: ${data.nama}, Kehadiran: ${data.kehadiran}, Keterangan: ${data.keterangan}\n`;
        });
        alert(laporan);
    });
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
    updateNamaKaryawanList();
});
