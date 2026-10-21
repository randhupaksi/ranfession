# Verifikasi dan QA

## Perintah repository

```powershell
npm run build
npm run lint
npm test
```

- `npm run build` menjalankan `tsc -b` sebelum Vite membuat folder `dist/`.
- `npm run lint` menjalankan Oxlint.
- `npm test` menjalankan `tests/journey.test.mjs` memakai Node test runner, Vite SSR loader, dan React server rendering.

Jalankan pemeriksaan yang relevan dengan perubahan, lalu laporkan command dan hasil sebenarnya. Build/lint/test tidak membuktikan kualitas visual, aksesibilitas dengan teknologi bantu, atau kualitas suara.

## Cakupan automated journey tests

Tes sekarang mencakup:

- validasi konfigurasi default dan fallback;
- opening belum me-mount story sampai Begin;
- daftar narrative berhenti di confession sebelum reveal;
- Final Click tidak berlaku sebelum Begin dan bersifat idempotent;
- return-to-opening dan replay;
- tambah/hapus/reorder scene serta pindah posisi confession;
- invalid scene opsional dan duplicate ID;
- copy narrative ada sebelum gate, sementara confession dan closing belum ada;
- confession/closing setelah gate serta unique heading IDs;
- sapaan netral, teks panjang, escaping HTML;
- sound default off;
- initial app SSR hanya me-render hero.

Suite ini tidak mengotomasi gerakan GSAP di browser atau menguji audio perangkat nyata.

## Checklist manual berdasarkan PRD

### Alur dan copy

- Buka dari fresh load; pastikan hero jelas dan tidak ada audio autoplay.
- Tekan Begin sekali/cepat berulang; pastikan tidak ada transisi bertumpuk.
- Scroll maju dan mundur, gunakan anchor/progress bila tersedia, dan baca ulang copy.
- Pastikan confession utama belum muncul sebelum Reveal.
- Tekan Reveal; pastikan confession tampil sekali, closing terbuka, lalu **Read again** mengulang tanpa sisa animation/audio.
- Periksa copy English, label kontrol, sapaan kosong/nama panjang, tanda kutip, apostrof, dan beberapa baris.

### Viewport, aksesibilitas, dan motion

- Uji ponsel kecil/umum/tinggi, tablet, desktop sempit/lebar, dan orientasi landscape.
- Perbesar teks/zoom browser; pastikan konten memanjang secara wajar dan tidak terpotong.
- Navigasi dengan Tab/Shift+Tab, Enter, dan Space. Pastikan fokus terlihat dan urutannya masuk akal.
- Periksa screen reader pada opening, tombol Reveal, confession yang muncul, audio, dan closing.
- Uji preferensi reduced motion dan kontrol motion. Pastikan semua teks/aksi tersedia tanpa animasi.
- Periksa kontras teks champagne/muted ukuran kecil serta target sentuh.

### Audio dan publikasi

- Pastikan audio mati sebelum interaksi. Aktifkan, kecilkan/besarkan volume, mute/unmute, dan pindah tab.
- Uji browser tanpa AudioContext atau dengan resume ditolak; halaman harus tetap berfungsi hening.
- Dengarkan pada speaker/headphone nyata dan cek tidak ada pop, clipping, atau level yang mengganggu.
- Pastikan tidak ada asset media eksternal yang diperlukan dan jangan menyimpulkan `noindex` sebagai privasi.

Catat browser, OS, viewport/perangkat, hasil, dan isu yang ditemukan ketika QA manual dilakukan. Saat lingkungan browser tidak tersedia, tandai QA tersebut sebagai pending alih-alih mengklaim lulus.
