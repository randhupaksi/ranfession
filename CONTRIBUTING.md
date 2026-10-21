# Berkontribusi ke Ranfession

Dokumen ini berlaku untuk perubahan kode, konten, dan dokumentasi di repository.

## Sebelum mengubah

1. Periksa status dan diff agar perubahan yang sudah ada tetap terjaga.
2. Baca `AGENTS.md` dan dokumen produk/arsitektur yang relevan.
3. Tentukan bagian produk yang berubah dan acceptance criteria terkait. Jangan menafsirkan ulang keputusan produk tanpa dasar dari pengguna.

## Menulis dan mengubah konten

- Ubah cerita melalui `src/content/story.ts`.
- Tulis semua copy untuk penerima dalam bahasa Inggris yang natural, lembut, dan tidak menekan.
- Gunakan nama penerima hanya bila memang tersedia; sapaan kosong harus tetap terdengar wajar.
- Jangan menaruh informasi sensitif, identitas pihak ketiga tanpa izin, atau copy yang mengharuskan penerima menjawab.
- Pertahankan satu `invitation` di awal, satu `confession` sebelum penutup, dan satu `closing` di akhir.

## Implementasi

- Ikuti pola React/TypeScript dan komponen yang sudah ada.
- Perubahan interaksi harus menjaga Final Click, native scrolling, keyboard, screen reader, reduced motion, dan pengalaman tanpa audio.
- Perubahan GSAP harus dibersihkan saat component/view berubah.
- Jangan menambahkan server, akun, tracking, external media, atau dependency tanpa kebutuhan yang jelas dan persetujuan sesuai ruang lingkup.
- Perbarui README atau dokumen di `docs/` ketika perilaku, konfigurasi, atau validasi berubah.

## Verifikasi dan review

Pilih pemeriksaan sesuai perubahan. Perintah proyek dan skenario manual ada di [`docs/verification.md`](docs/verification.md). Untuk perubahan UI, catat batas pemeriksaan visual jika browser atau perangkat tidak tersedia. Jangan menyamakan build yang lulus dengan QA visual yang lengkap.

Perubahan Git harus mudah direview dan hanya mencakup file terkait. Jangan menjalankan staging, commit, atau push tanpa instruksi pengguna yang menyebut operasi tersebut secara jelas.
