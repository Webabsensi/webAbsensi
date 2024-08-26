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

    // Simpan data ke Firebase dengan ID yang otomatis di-generate
    const absensiRef = database.ref('absensi/' + tanggal).push();

    absensiRef.set({
        id: absensiRef.key,
        nama: namaKaryawan,
        tanggal: tanggal,
        kehadiran: kehadiran,
        keterangan: keterangan
    });

    // Reset form setelah menyimpan absensi
    document.getElementById('absensi-form').reset();

    // Tampilkan pesan sukses tanpa alert
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = `Absensi disimpan!\nNama: ${namaKaryawan}\nTanggal: ${tanggal}\nKehadiran: ${kehadiran}\nKeterangan: ${keterangan}`;
    messageBox.style.display = 'block';
}

// Fungsi untuk menambah karyawan
function tambahKaryawan(event) {
    event.preventDefault();
    const nama = document.getElementById('nama').value;
    database.ref('karyawan/').push({
        nama: nama
    });

    updateNamaKaryawanList();

    // Tampilkan pesan sukses tanpa alert
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = `Karyawan ${nama} telah ditambahkan.`;
    messageBox.style.display = 'block';
}

// Fungsi untuk memperbarui daftar nama karyawan
function updateNamaKaryawanList() {
    const list = document.getElementById('nama-karyawan-list');
    const namaAbsensi = document.getElementById('nama-absensi');
    const namaKaryawanHapus = document.getElementById('nama-karyawan-hapus');
    
    list.innerHTML = '';
    namaAbsensi.innerHTML = '';
    namaKaryawanHapus.innerHTML = '';

    database.ref('karyawan/').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const karyawan = childSnapshot.val();
            const key = childSnapshot.key;

            // Tampilkan daftar karyawan di halaman nama karyawan
            const listItem = document.createElement('li');
            listItem.textContent = karyawan.nama;
            list.appendChild(listItem);

            // Tambahkan nama karyawan di pilihan absensi
            const optionItem = document.createElement('option');
            optionItem.value = key; // Menggunakan key sebagai value
            optionItem.textContent = karyawan.nama;
            namaAbsensi.appendChild(optionItem);

            // Tambahkan nama karyawan di pilihan penghapusan karyawan
            const optionItemHapus = document.createElement('option');
            optionItemHapus.value = key; // Menggunakan key sebagai value
            optionItemHapus.textContent = karyawan.nama;
            namaKaryawanHapus.appendChild(optionItemHapus);
        });
    });
}

// Fungsi untuk melihat laporan harian
function lihatLaporan(event) {
    event.preventDefault();
    const tanggal = document.getElementById('tanggal').value;
    const laporanBox = document.getElementById('laporan-box');
    laporanBox.innerHTML = '';

    // Ambil data dari Firebase dan tampilkan
    database.ref('absensi/' + tanggal).once('value', snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                const laporanItem = document.createElement('div');
                laporanItem.textContent = `Nama: ${data.nama}, Tanggal: ${data.tanggal}, Kehadiran: ${data.kehadiran}, Keterangan: ${data.keterangan}`;
                laporanBox.appendChild(laporanItem);
            });
        } else {
            laporanBox.textContent = 'Tidak ada laporan untuk tanggal tersebut.';
        }
    });
}

// Fungsi untuk menampilkan atau menyembunyikan keterangan absensi
function toggleKeterangan(kehadiran) {
    const keteranganHadir = document.getElementById('keterangan-hadir');
    const keteranganTidakHadir = document.getElementById('keterangan-tidak-hadir');

    if (kehadiran === 'Hadir') {
        keteranganHadir.style.display = 'block';
        keteranganTidakHadir.style.display = 'none';
    } else if (kehadiran === 'Tidak Hadir') {
        keteranganHadir.style.display = 'none';
        keteranganTidakHadir.style.display = 'block';
    }
}

// Fungsi untuk menghapus karyawan
function hapusKaryawan(event) {
    event.preventDefault();
    const key = document.getElementById('nama-karyawan-hapus').value;

    if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
        // Hapus karyawan dari Firebase
        database.ref('karyawan/' + key).remove()
            .then(() => {
                updateNamaKaryawanList();

                // Tampilkan pesan sukses tanpa alert
                const messageBox = document.getElementById('message-box');
                messageBox.textContent = 'Karyawan berhasil dihapus.';
                messageBox.style.display = 'block';
            })
            .catch(error => {
                console.error('Error saat menghapus karyawan:', error);
            });
    }
}

// Tampilkan menu utama secara default saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    showContent('menu-utama');
    updateNamaKaryawanList();
});
