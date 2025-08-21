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

    // Fungsi utama untuk mengambil data IP
    const getIpInfo = (ipAddress = '') => {
        // Tampilkan status loading
        ipCard.classList.add('loading');
        loadingMessage.textContent = 'Memuat data, mohon tunggu...';
        infoContent.classList.add('hidden');
        
        // --- PERUBAHAN DI SINI ---
        // Mengubah URL API dari http menjadi https
        const apiUrl = `https://ip-api.com/json/${ipAddress}?fields=status,message,query,isp,country,city,mobile,proxy,hosting`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update judul kartu
                    cardTitle.textContent = ipAddress ? `Hasil Pencarian untuk: ${data.query}` : 'Informasi IP Anda';

                    // Masukkan data ke elemen HTML
                    ipAddressEl.textContent = data.query;
                    ispEl.textContent = data.isp || '-';
                    locationEl.textContent = data.city ? `${data.city}, ${data.country}` : data.country || '-';

                    // Logika untuk Tipe Koneksi
                    if (data.hosting) {
                        connectionTypeEl.textContent = 'Data Center';
                        connectionTypeEl.className = 'status status-info';
                    } else if (data.mobile) {
                        connectionTypeEl.textContent = 'Mobile';
                        connectionTypeEl.className = 'status status-warning';
                    } else {
                        connectionTypeEl.textContent = 'Residential';
                        connectionTypeEl.className = 'status status-safe';
                    }

                    // Logika untuk deteksi Proxy/VPN
                    if (data.proxy) {
                        anonymityEl.textContent = 'Terdeteksi (Yes)';
                        anonymityEl.className = 'status status-danger';
                    } else {
                        anonymityEl.textContent = 'Tidak Terdeteksi (No)';
                        anonymityEl.className = 'status status-safe';
                    }
                    
                    // Tampilkan hasil dan sembunyikan loading
                    ipCard.classList.remove('loading');
                    infoContent.classList.remove('hidden');

                } else {
                    // Jika API mengembalikan error (misal: IP tidak valid)
                    throw new Error(data.message || 'Gagal memuat data IP.');
                }
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
                cardTitle.textContent = 'Terjadi Kesalahan';
                loadingMessage.textContent = `Gagal memuat data. Error: ${error.message}`;
                ipCard.classList.remove('loading');
            });
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

    // Panggil fungsi saat halaman pertama kali dimuat untuk mendapatkan IP pengguna
    getIpInfo();
});
