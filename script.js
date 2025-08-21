document.addEventListener('DOMContentLoaded', () => {
    // Mendapatkan referensi ke semua elemen yang diperlukan
    const ipInput = document.getElementById('ip-input');
    const lookupButton = document.getElementById('lookup-button');
    const ipCard = document.getElementById('ip-info-card');
    const cardTitle = document.getElementById('card-title');
    const loadingMessage = document.getElementById('loading-message');
    const infoContent = document.getElementById('info-content');
    
    const ipAddressEl = document.getElementById('ip-address');
    const ispEl = document.getElementById('isp');
    const locationEl = document.getElementById('location');
    const connectionTypeEl = document.getElementById('connection-type');
    const anonymityEl = document.getElementById('anonymity');

    // Fungsi utama untuk mengambil data IP menggunakan DUA API
    const getIpInfo = async (ipAddress = '') => {
        // Tampilkan status loading
        ipCard.classList.add('loading');
        loadingMessage.textContent = 'Memuat data dari beberapa sumber, mohon tunggu...';
        infoContent.classList.add('hidden');
        
        try {
            // --- PANGGILAN API #1: ipapi.co (Untuk Info Dasar) ---
            const response1 = await fetch(`https://ipapi.co/${ipAddress}/json/`);
            const dataIpApiCo = await response1.json();

            if (dataIpApiCo.error) {
                throw new Error(dataIpApiCo.reason || 'IP tidak valid atau tidak ditemukan.');
            }
            
            // Ambil IP yang sudah dikonfirmasi dari panggilan pertama
            const confirmedIp = dataIpApiCo.ip;

            // --- PANGGILAN API #2: ipinfo.io (Untuk Info Keamanan) ---
            const response2 = await fetch(`https://ipinfo.io/${confirmedIp}/json`);
            const dataIpInfoIo = await response2.json();

            // --- PENGGABUNGAN & TAMPILKAN DATA ---
            
            // Update judul kartu
            cardTitle.textContent = ipAddress ? `Hasil Pencarian untuk: ${confirmedIp}` : 'Informasi IP Anda';

            // 1. Tampilkan data dari ipapi.co
            ipAddressEl.textContent = dataIpApiCo.ip;
            ispEl.textContent = dataIpApiCo.org || '-';
            locationEl.textContent = dataIpApiCo.city ? `${dataIpApiCo.city}, ${dataIpApiCo.country_name}` : dataIpApiCo.country_name || '-';

            // 2. Tampilkan data dari ipinfo.io
            // Logika untuk Tipe Koneksi
            if (dataIpInfoIo.abuse?.type === 'hosting') {
                connectionTypeEl.textContent = 'Data Center';
                connectionTypeEl.className = 'status status-info';
            } else {
                connectionTypeEl.textContent = 'ISP/Residential';
                connectionTypeEl.className = 'status status-safe';
            }

            // Logika untuk deteksi Proxy/VPN
            if (dataIpInfoIo.abuse?.type === 'vpn' || dataIpInfoIo.abuse?.type === 'proxy') {
                anonymityEl.textContent = 'Terdeteksi (Yes)';
                anonymityEl.className = 'status status-danger';
            } else {
                anonymityEl.textContent = 'Tidak Terdeteksi (No)';
                anonymityEl.className = 'status status-safe';
            }
            
            // Selesai, tampilkan hasilnya
            ipCard.classList.remove('loading');
            infoContent.classList.remove('hidden');

        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            cardTitle.textContent = 'Terjadi Kesalahan';
            loadingMessage.textContent = `Gagal memuat data. Error: ${error.message}`;
            ipCard.classList.remove('loading');
        }
    };

    // Event listener untuk tombol pencarian
    lookupButton.addEventListener('click', () => {
        const ipToLookup = ipInput.value.trim();
        if (ipToLookup) {
            getIpInfo(ipToLookup);
        } else {
            alert('Silakan masukkan alamat IP terlebih dahulu.');
        }
    });
    
    // Event listener untuk menekan "Enter" di input field
    ipInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            lookupButton.click();
        }
    });

    // Panggil fungsi saat halaman pertama kali dimuat
    getIpInfo();
});
