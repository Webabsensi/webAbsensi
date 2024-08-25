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
    const list = document.getElementById('nama-karyawan-list');

    const listItem = document.createElement('li');
    listItem.textContent = nama;
    list.appendChild(listItem);

    alert(`Karyawan ${nama} telah ditambahkan.`);
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
