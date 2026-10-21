# Instruksi Agent — Ranfession

## Sumber kebenaran

Sebelum mengubah produk, baca [gambaran produk](docs/product-overview.md), [arsitektur](docs/architecture.md), dan dokumentasi spesifik yang berhubungan dengan perubahan. PRD sumber adalah `PRD_Confession_Codex_Versi_Baru.docx`; ringkasannya dan status terhadap implementasi ada di `docs/product-overview.md` serta `docs/requirements-traceability.md`.

PRD adalah konteks kebutuhan produk, bukan izin untuk membuat layanan lain atau mengabaikan permintaan terbaru pengguna. Untuk alur antarmuka, keputusan terbaru yang berlaku adalah: hero pembuka satu layar, lalu cerita scroll. Tidak semua scene memerlukan tombol Reveal/Continue. **Final Click** tetap wajib menjadi satu-satunya gerbang yang menampilkan isi confession.

## Batas produk yang harus dijaga

- Pengalaman untuk satu pengirim dan satu penerima, tersedia sebagai website statis publik.
- Teks yang terlihat oleh pengunjung tetap dalam bahasa Inggris dengan nada sincere dan gentle.
- Pertahankan tema Midnight Elegance: charcoal gelap, ivory hangat, dan aksen champagne; aksen artistik tambahan harus tetap terkendali.
- Jangan menambahkan login, dashboard, backend pesan, database, form balasan, tombol Yes/No, chat, read receipt, analytics penerima, atau tracking.
- Ending tidak meminta jawaban dan tidak mengarahkan penerima ke chat untuk membalas.
- Audio harus opt-in, mulai dalam keadaan hening, dan tidak dibutuhkan untuk membaca cerita.
- Cerita harus tetap utuh tanpa audio, animasi, media eksternal, atau motion yang dipertahankan.
- Anggap seluruh copy yang di-build dapat dilihat publik. Jangan menambahkan rahasia atau detail pribadi sensitif.

## Aturan implementasi

- `src/content/story.ts` adalah sumber konten dan skema scene. Jangan menduplikasi copy atau nomor scene secara manual di UI.
- `src/lib/journey.ts` mengatur state journey dan aturan kapan scene penutup tersedia. Jaga gate berdasarkan role `confession`, bukan indeks tertentu.
- Pertahankan native document scrolling dan anchor browser. Jangan menambahkan scroll hijacking, snap wajib, atau navigasi swipe-only.
- Gunakan komponen dan token visual yang ada. CSS umum berada di `src/App.css`, token dasar di `src/index.css`, dan layout scroll/art direction di `src/scroll-story.css`.
- GSAP berada di `src/hooks/useStoryMotion.ts`. Bersihkan animation/ScrollTrigger melalui context dan hormati preferensi reduced motion serta kontrol motion di UI.
- Audio berada di `src/hooks/useAmbience.ts` dan `src/components/SoundControl.tsx`. Jangan membuat AudioContext sebelum tindakan pengguna.
- Pertahankan elemen semantik, focus-visible, teks alternatif screen reader, target sentuh yang memadai, safe area mobile, dan perilaku yang bisa dibaca saat zoom.
- Jangan menambah dependency tanpa kebutuhan jelas. Tidak ada asset eksternal yang diperlukan untuk menyelesaikan pengalaman.
- Jika perilaku, struktur konfigurasi, atau proses kerja berubah, perbarui dokumentasi yang terdampak.

## Pemeriksaan dan Git

Perintah proyek ada di `package.json`. Jalankan pemeriksaan yang relevan dengan perubahan: `npm run lint`, `npm test`, `npm run build`, dan `npm run test:e2e`. E2E memakai Chromium Playwright; pasang browser lokal dengan `npm run e2e:install`, sedangkan workflow CI memasang Chromium beserta dependensi Linux. `npm run verify` menjalankan seluruh rangkaian tersebut setelah browser tersedia. Perubahan visual juga membutuhkan review manual di browser/perangkat saat lingkungan tersedia; jangan mengklaimnya jika belum dilakukan.

Pertahankan perubahan pengguna yang sudah ada. Operasi Git read-only boleh dilakukan untuk memeriksa status/diff. Jangan menjalankan `git add`, commit, push, merge, rebase, reset, atau mengubah history kecuali pengguna secara spesifik meminta operasi tersebut. Permintaan “list Git command” berarti menyiapkan daftar teks dengan path spesifik, bukan menjalankan command.
