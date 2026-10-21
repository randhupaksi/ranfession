# Ranfession

Ranfession is a personal confession told as a quiet digital letter. The experience opens with a single-screen invitation, moves into a scroll-led story, and keeps the confession itself behind one deliberate **Final Click**. It is designed to communicate honestly without asking the reader to respond.

The visitor-facing interface and story copy are in English. Project documentation is in Indonesian.

## Mulai di komputer lokal

Gunakan Node.js dan npm, lalu jalankan:

```powershell
npm ci
npm run dev
```

Perintah yang tersedia:

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan Vite development server. |
| `npm run build` | Menjalankan TypeScript build check lalu membuat situs statis di `dist/`. |
| `npm run preview` | Melihat hasil build lokal dari folder `dist/`. Jalankan build lebih dulu. |
| `npm run lint` | Menjalankan Oxlint. |
| `npm test` | Menjalankan tes journey menggunakan Node test runner dan Vite SSR. |

## Sesuaikan cerita

Mulai dari [`src/content/story.ts`](src/content/story.ts). Di sana terdapat judul, sapaan penerima, nama pengirim, dedication, label kontrol, opsi suasana, serta daftar scene. Ganti teks contoh dengan kata-kata yang benar-benar ingin kamu sampaikan sebelum membagikan situs.

Aturan scene dan contoh bentuk konfigurasi dijelaskan di [Panduan menulis konten](docs/content-authoring.md). Jangan masukkan informasi yang kamu anggap rahasia: seluruh konten merupakan bagian dari website publik.

## Alur produk saat ini

1. Penerima tiba di hero satu layar dan memilih **Begin**.
2. Cerita berlanjut sebagai halaman yang dapat di-scroll. Tiap chapter punya komposisi berbeda; motion membantu memberi ritme, tetapi tidak menjadi syarat untuk membaca.
3. Pengunjung dapat membaca sampai confession. Kalimat confession baru muncul setelah tombol **Reveal** ditekan.
4. Setelah itu, halaman penutup tersedia. **Read again** mengulang pengalaman dari awal.

PRD awal mengusulkan interaksi klik pada setiap fragmen. Keputusan produk terbaru mengubah bentuk navigasi menjadi hero tetap lalu cerita scroll. Final Click, penutup tanpa tekanan untuk membalas, bahasa UI Inggris, audio opsional, dan batas privasi dari PRD tetap berlaku. Rinciannya ada di [Gambaran produk](docs/product-overview.md) dan [Traceability PRD](docs/requirements-traceability.md).

## Peta dokumentasi

- [AGENTS.md](AGENTS.md) — aturan kerja agent untuk repo ini.
- [CLAUDE.md](CLAUDE.md) — instruksi Claude Code; menunjuk ke aturan repo yang sama.
- [CONTRIBUTING.md](CONTRIBUTING.md) — alur perubahan dan review.
- [Gambaran produk](docs/product-overview.md) — visi, cakupan, dan alur yang berlaku.
- [Traceability PRD](docs/requirements-traceability.md) — status implementasi AC-01 sampai AC-15 dan bukti yang tersedia.
- [Arsitektur](docs/architecture.md) — struktur modul, state, validasi, dan batas sistem.
- [Panduan menulis konten](docs/content-authoring.md) — cara mengubah scene dengan aman.
- [Interaksi, aksesibilitas, dan motion](docs/interaction-accessibility-motion.md) — perilaku scroll, Final Click, fokus, serta reduced motion.
- [Audio, privasi, dan publikasi](docs/audio-privacy-deployment.md) — Web Audio, data, `noindex`, dan hosting statis.
- [Verifikasi](docs/verification.md) — perintah pengecekan dan skenario manual dari PRD.

## Batas produk dan privasi

Situs ini tidak memiliki login, database, form balasan, chat, analytics penerima, atau backend pesan. Audio dibuat lokal di browser dan mati secara default. Tidak ada foto, video, font, atau lagu eksternal yang diperlukan. `noindex, nofollow` hanya meminta mesin pencari untuk tidak mengindeks halaman; URL tetap publik dan metadata tersebut bukan kontrol akses.

## Publikasi

Jalankan `npm run build`, lalu host isi folder `dist/` pada layanan hosting statis. Belum ada konfigurasi backend atau environment variable yang diperlukan oleh aplikasi.
