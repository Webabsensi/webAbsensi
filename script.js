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

    const absensiRef = firebase.database().ref('absensi/' + new Date().toISOString().split('T')[0]); // Menyimpan berdasarkan tanggal
    absensiRef.push({
        namaKaryawan: namaKaryawan,
        kehadiran: kehadiran,
        keterangan: keterangan
    }).then(() => {
        alert(`Absensi disimpan!\nNama: ${namaKaryawan}\nKehadiran: ${kehadiran}\nKeterangan: ${keterangan}`);
    }).catch(error => {
        console.error('Error menambahkan data:', error);
    });
}

// Fungsi untuk menambah karyawan
function tambahKaryawan(event) {
    event.preventDefault();
    const nama = document.getElementById('nama').value;
    const list = document.getElementById('nama-karyawan-list');

    const listItem = document.createElement('li');
    listItem.textContent = nama;
    list.appendChild(listItem);

    const karyawanRef = firebase.database().ref('karyawan');
    karyawanRef.push({ nama: nama }).then(() => {
        alert(`Karyawan ${nama} telah ditambahkan.`);
    }).catch(error => {
        console.error('Error menambahkan karyawan:', error);
    });
}

// Fungsi untuk melihat laporan
function lihatLaporan(event) {
    event.preventDefault();
    const tanggal = document.getElementById('tanggal').value;

    const laporanRef = firebase.database().ref('absensi/' + tanggal);
    laporanRef.once('value', (snapshot) => {
        const laporanList = document.getElementById('laporan-list');
        laporanList.innerHTML = ''; // Kosongkan daftar sebelumnya

        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            const listItem = document.createElement('li');
            listItem.textContent = `Nama: ${data.namaKaryawan}, Kehadiran: ${data.kehadiran}, Keterangan: ${data.keterangan}`;
            laporanList.appendChild(listItem);
        });

        if (!snapshot.exists()) {
            laporanList.innerHTML = 'Tidak ada data untuk tanggal ini.';
        }
    }).catch(error => {
        console.error('Error mengambil data laporan:', error);
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
});
