# Traceability PRD

Status berikut menggambarkan implementasi kode yang ada dan bukti pemeriksaan di repository. “Manual QA pending” berarti kode atau styling tersedia, tetapi belum ada bukti pemeriksaan langsung pada kombinasi browser/perangkat yang disebut. Build dan test tidak membuktikan kualitas visual atau audio.

## Acceptance criteria

| AC | Status saat ini | Implementasi dan bukti |
| --- | --- | --- |
| AC-01 Identity | Implemented; visual review pending | Palet gelap, champagne/ivory, serif/sans, komposisi chapter bervariasi. Perlu review browser untuk menilai hasil visual akhirnya. |
| AC-02 First impression | Implemented | Initial render hanya menampilkan hero; tidak ada audio autoplay atau login. `tests/journey.test.mjs` memeriksa render awal. |
| AC-03 Story sequence | Implemented with approved hybrid flow | `storyConfig` berisi delapan scene dari invitation sampai closing. Navigasi setelah Begin memakai scroll sesuai keputusan terbaru pengguna. |
| AC-04 Flexible story | Implemented; automated coverage present | `resolveScenes` memvalidasi urutan/role dan hitungan progress berasal dari daftar scene. Tes mencakup tambah, hapus, reorder, dan perpindahan posisi confession. |
| AC-05 Reveal control | Adapted by latest user decision | Narrative text tidak memerlukan tombol Reveal per fragmen. ScrollTrigger hanya menambahkan entrance motion. Final Click tetap satu-satunya aksi yang membuka confession dan penutup. |
| AC-06 Back and replay | Adapted to native scrolling | Pengunjung dapat scroll ke atas untuk membaca lagi; wordmark kembali ke opening; **Read again** mereset journey. Tidak ada tombol Back pada setiap chapter. |
| AC-07 Confession moment | Implemented; automated coverage present | Kalimat utama tidak dimasukkan ke DOM sebelum reveal. Tes membandingkan markup sebelum/sesudah Final Click. Visual QA masih perlu browser. |
| AC-08 No reply pressure | Implemented in product UI | Closing tidak memiliki Yes/No, form, tautan balasan, atau permintaan respons. |
| AC-09 English writing | Implemented in default visitor copy | UI dan copy default berbahasa Inggris. Pengirim bertanggung jawab menjaga bahasa dan nada saat mengubah konfigurasi. |
| AC-10 Mobile quality | Responsive rules implemented; device QA pending | Layout memakai breakpoint, safe area, target kontrol yang besar, dan wrapping untuk teks panjang. Perlu uji ponsel kecil, zoom, landscape, tablet, dan desktop. |
| AC-11 Accessibility | Support implemented; assistive-technology QA pending | Semantic headings/sections, skip link, focus handling, screen-reader copy, visible focus, keyboard-operable native controls, dan reduced motion tersedia. Perlu pemeriksaan keyboard/screen reader/kontras langsung. |
| AC-12 Procedural audio | Implemented; listening QA pending | `useAmbience` membuat suara procedural setelah tindakan pengguna, default mute, volume rendah, fade, suspend tab tersembunyi, dan fallback unavailable. Belum ada klaim bahwa kualitas audio sudah didengar di perangkat nyata. |
| AC-13 Lightweight experience | Implemented | Tidak ada media eksternal yang menjadi syarat cerita. Ornamen dibuat lewat SVG/CSS. Dependensi runtime dibundel saat build. |
| AC-14 Public access and privacy | Implemented at app level | Tidak ada auth, API, persistence, atau tracking penerima di source app. Semua copy dalam build bersifat publik. Hosting dapat memiliki kebijakan/log tersendiri. `noindex` bukan kontrol akses. |
| AC-15 Production readiness | Partially verified | Error boundary dan fallback konfigurasi tersedia; build, lint, serta tes tersedia sebagai perintah proyek. Kesiapan penuh tetap memerlukan review browser, mobile, keyboard, dan audio. |

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
