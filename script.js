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

// Fungsi untuk menampilkan pesan ke message-box
function showMessage(message, isError = false) {
    const messageBox = document.getElementById('message-box');
    messageBox.style.display = 'block';
    messageBox.style.color = isError ? 'red' : 'green';
    messageBox.textContent = message;
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
    const jam = new Date().toTimeString().split(' ')[0]; // Ambil waktu saat ini dalam format HH:MM:SS

    // Ambil nama karyawan dari Firebase berdasarkan ID
    database.ref('karyawan/').once('value', snapshot => {
        let namaKaryawanTersimpan = '';
        snapshot.forEach(childSnapshot => {
            if (childSnapshot.key === namaKaryawan) {
                namaKaryawanTersimpan = childSnapshot.val().nama;
            }
        });

        if (namaKaryawanTersimpan) {
            const absensiRef = database.ref('absensi/' + tanggal).push();
            absensiRef.set({
                nama: namaKaryawanTersimpan, // Urutan pertama
                kehadiran: kehadiran,       // Urutan kedua
                keterangan: keterangan,     // Urutan ketiga
                jam: jam,                   // Urutan keempat
                tanggal: tanggal            // Urutan kelima
            }).then(() => {
                showMessage(`Absensi disimpan!\nNama: ${namaKaryawanTersimpan}\nTanggal: ${tanggal}\nJam: ${jam}\nKehadiran: ${kehadiran}\nKeterangan: ${keterangan}`);
                resetFormAbsensi(); // Reset form setelah berhasil menyimpan absensi
            }).catch(error => {
                showMessage('Terjadi kesalahan saat menyimpan absensi.', true);
                console.error('Error saat menyimpan absensi:', error);
            });
        } else {
            showMessage('Nama karyawan tidak ditemukan.', true);
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
    } else {
        keteranganHadir.style.display = 'none';
        keteranganTidakHadir.style.display = 'none';
    }
}

// Fungsi untuk mereset form absensi
function resetFormAbsensi() {
    document.getElementById('absensi-form').reset(); // Asumsi form absensi memiliki ID 'absensi-form'
    toggleKeterangan(''); // Sembunyikan semua keterangan
}

// Fungsi untuk menambah karyawan
function tambahKaryawan(event) {
    event.preventDefault();
    const nama = document.getElementById('nama').value;
    database.ref('karyawan/').push({
        nama: nama
    }).then(() => {
        updateNamaKaryawanList();
        showMessage(`Karyawan ${nama} telah ditambahkan.`);
    }).catch(error => {
        showMessage('Terjadi kesalahan saat menambahkan karyawan.', true);
        console.error('Error saat menambah karyawan:', error);
    });
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

    // Ambil data dari Firebase dan tampilkan
    database.ref('absensi/' + tanggal).once('value', snapshot => {
        let laporan = `Laporan untuk tanggal: ${tanggal}\n\n`;
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                // Menampilkan data dengan urutan yang diinginkan
                laporan += `Nama: ${data.nama}\n`;
                laporan += `Kehadiran: ${data.kehadiran}\n`;
                laporan += `Keterangan: ${data.keterangan}\n`;
                laporan += `Jam: ${data.jam}\n`;
                laporan += `Tanggal: ${data.tanggal}\n\n`;
            });
            showMessage(laporan);
        } else {
            showMessage('Tidak ada laporan untuk tanggal ini.', true);
        }
    }).catch(error => {
        showMessage('Terjadi kesalahan saat mengambil laporan.', true);
        console.error('Error saat melihat laporan:', error);
    });
}

// Fungsi untuk menghapus karyawan
function hapusKaryawan(event) {
    event.preventDefault();
    const key = document.getElementById('nama-karyawan-hapus').value;

    if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
        // Hapus karyawan dari Firebase
        database.ref('karyawan/' + key).remove()
            .then(() => {
                showMessage('Karyawan berhasil dihapus.');
                updateNamaKaryawanList();
            })
            .catch(error => {
                showMessage('Terjadi kesalahan saat menghapus karyawan.', true);
                console.error('Error saat menghapus karyawan:', error);
            });
    }
}

// Tampilkan menu utama secara default saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    showContent('menu-utama');
    updateNamaKaryawanList();
    toggleKeterangan();
});
