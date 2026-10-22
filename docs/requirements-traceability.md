# Traceability PRD

Status berikut menggambarkan implementasi kode yang ada dan bukti pemeriksaan di repository. “Manual QA pending” berarti kode atau styling tersedia, tetapi belum ada bukti pemeriksaan langsung pada kombinasi browser/perangkat yang disebut. Build dan test tidak membuktikan kualitas visual atau audio.

## Acceptance criteria

| AC                              | Status saat ini                                                                           | Implementasi dan bukti                                                                                                                                                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-01 Identity                  | Implemented; visual review pending                                                        | Palet gelap, champagne/ivory, serif/sans, komposisi chapter bervariasi. Perlu review browser untuk menilai hasil visual akhirnya.                                                                                                                       |
| AC-02 First impression          | Implemented; automated coverage present                                                   | Initial render hanya menampilkan hero; tidak ada audio autoplay atau login. `tests/journey.test.mjs` dan Playwright E2E memeriksa hero awal serta audio yang mati.                                                                                      |
| AC-03 Story sequence            | Implemented with approved hybrid flow                                                     | `storyConfig` berisi delapan scene dari invitation sampai closing. Navigasi setelah Begin memakai scroll sesuai keputusan terbaru pengguna.                                                                                                             |
| AC-04 Flexible story            | Implemented; automated coverage present                                                   | `resolveScenes` memvalidasi urutan/role dan hitungan progress berasal dari daftar scene. Tes mencakup tambah, hapus, reorder, dan perpindahan posisi confession.                                                                                        |
| AC-05 Reveal control            | Adapted by latest user decision; E2E coverage present                                     | Narrative text tidak memerlukan tombol Reveal per fragmen. ScrollTrigger hanya menambahkan entrance motion. Final Click tetap satu-satunya aksi yang membuka confession dan penutup; E2E menjalankan Reveal via keyboard.                               |
| AC-06 Back and replay           | Adapted to native scrolling; E2E coverage present                                         | Pengunjung dapat scroll ke atas untuk membaca lagi; wordmark kembali ke opening; **Read again** mereset journey dan diuji lewat E2E. Tidak ada tombol Back pada setiap chapter.                                                                         |
| AC-07 Confession moment         | Implemented; unit and E2E coverage present                                                | Kalimat utama tidak dimasukkan ke DOM sebelum reveal. Unit test membandingkan markup sebelum/sesudah Final Click; E2E memeriksa gerbang di browser. Visual QA masih perlu review manual.                                                                |
| AC-08 No reply pressure         | Implemented in product UI                                                                 | Closing tidak memiliki Yes/No, form, tautan balasan, atau permintaan respons.                                                                                                                                                                           |
| AC-09 English writing           | Implemented in default visitor copy                                                       | UI dan copy default berbahasa Inggris. Pengirim bertanggung jawab menjaga bahasa dan nada saat mengubah konfigurasi.                                                                                                                                    |
| AC-10 Mobile quality            | Responsive rules implemented; mobile viewport E2E present; device QA pending              | E2E memeriksa alur Final Click pada lebar 390 px dan memastikan tidak ada horizontal overflow. Perlu uji perangkat nyata, zoom, landscape, tablet, dan desktop.                                                                                         |
| AC-11 Accessibility             | Support implemented; keyboard/reduced-motion E2E present; assistive-technology QA pending | Semantic headings/sections, skip link, focus handling, screen-reader copy, visible focus, keyboard-operable controls, dan reduced motion tersedia. E2E menjalankan Reveal via keyboard dan reduced-motion; screen reader/kontras tetap perlu QA manual. |
| AC-12 Procedural audio          | Implemented; default-off E2E present; listening QA pending                                | `useAmbience` membuat suara procedural setelah tindakan pengguna, default mute, volume rendah, fade, suspend tab tersembunyi, dan fallback unavailable. E2E memeriksa audio mati pada awal; kualitas suara masih perlu didengar di perangkat nyata.     |
| AC-13 Lightweight experience    | Implemented                                                                               | Tidak ada media eksternal yang menjadi syarat cerita. Ornamen dibuat lewat SVG/CSS. Dependensi runtime dibundel saat build.                                                                                                                             |
| AC-14 Public access and privacy | Implemented at app level                                                                  | Tidak ada auth, API, persistence, atau tracking penerima di source app. Semua copy dalam build bersifat publik. Hosting dapat memiliki kebijakan/log tersendiri. `noindex` bukan kontrol akses.                                                         |
| AC-15 Production readiness      | CI and Vercel config implemented; deployment/manual QA pending                            | GitHub Actions menjalankan lint, unit test, build, dan Chromium E2E. `vercel.json` menyiapkan static build. Koneksi Git Vercel dan review browser, mobile, keyboard, serta audio tetap perlu dilakukan sebelum URL dibagikan.                           |

## Keputusan yang menggantikan bagian PRD

PRD awal meminta alur fullscreen/click-to-reveal untuk setiap scene dan fragmen. Pemilik proyek kemudian meminta hero pertama tetap satu layar dan halaman berikutnya menjadi scroll, dengan interaksi campuran. Karena itu:

- **Begin** memindahkan dari hero ke cerita scroll.
- Narasi tidak ditahan sampai tombol per fragmen; teks tersedia saat story mount.
- Scrolling browser tetap native, bukan diambil alih aplikasi.
- Reveal eksplisit tetap digunakan untuk pengakuan inti.
- Setelah Reveal, chapter closing dimasukkan ke halaman.
- Reread sebelumnya terjadi dengan scroll/anchor, bukan tombol Back pada setiap scene.

Perubahan ini adalah keputusan produk terbaru, bukan bug terhadap implementasi saat ini.

## Skenario yang masih perlu QA langsung

Rujuk daftar langkah lengkap di [`verification.md`](verification.md). Yang paling penting sebelum dibagikan: first open di ponsel, perjalanan penuh, Final Click, teks panjang/zoom, keyboard dan screen reader, reduced motion, audio enable/mute/tab switch/fallback, dan replay berulang.
