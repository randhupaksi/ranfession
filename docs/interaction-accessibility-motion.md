# Interaksi, Aksesibilitas, dan Motion

## Pola navigasi yang berlaku

Ranfession memakai flow hybrid: hero pembuka satu layar, lalu halaman cerita dengan native scroll. Ini adalah keputusan produk terbaru dan menggantikan click-to-reveal per fragmen yang tertulis pada PRD awal.

- **Begin** memulai story view.
- Scrolling dan anchor browser memindahkan posisi baca. Scroll tidak membuka Final Click.
- Dots progress di desktop menunjuk ke chapter yang sedang tersedia. Scroll cue juga berupa anchor biasa.
- Wordmark kembali ke opening.
- **Reveal** pada confession membuka kalimat inti dan mem-mount closing.
- **Read again** mengulang journey dari keadaan awal.

Tidak ada snap-scroll atau scroll hijacking. Ukuran teks/zoom boleh membuat dokumen lebih panjang.

## Struktur dan kontrol aksesibilitas

- Hero dan story memakai `main`; story menggunakan `section` yang dihubungkan dengan heading melalui `aria-labelledby`.
- Skip link menyediakan akses langsung ke konten utama.
- Headings diberi `tabIndex=-1` untuk fokus programatik ketika view berubah; fokus keyboard memakai outline kontras.
- Native `button`, `a`, dan `input range` menyediakan aktivasi keyboard yang sesuai.
- Ornamen SVG memiliki `aria-hidden="true"` dan bukan sumber informasi produk.
- Copy visual yang dipecah untuk animasi memiliki salinan screen-reader tanpa animasi. Perubahan confession berada dalam region live polite.
- Label sound, motion, navigation, dan kontrol penting menyebut fungsi, bukan hanya ikon.

## Motion

`useStoryMotion` memakai atribut `data-motion` untuk mendaftarkan kelompok UI yang memang perlu bergerak: label dan garis eyebrow, sapaan, kata pada judul, kartu/fragmen, teks isi, nomor dan indeks bab, ornamen section, tombol, scroll cue, serta divider. Pseudo-element yang membawa aksen visual utama (tanda kutip, frame confession, label hero, bintang footer, dan garis section) telah menjadi elemen DOM agar GSAP dapat menargetkannya. Kata pada judul di-stagger dalam satu timeline; isi dan ornamen lain dianimasikan per kelompok untuk membatasi jumlah trigger.

Entrance hero diputar saat opening dimuat; header, rail, dan benang vertikal membaca masuk sekali ketika story view dimulai lalu tetap stabil selama scroll. Setiap kelompok di section memakai ScrollTrigger yang sama-sama dapat dibalik: saat pembaca melewati batas pemicu ke atas, elemen meredup/bergerak keluar; saat scroll turun lagi, entrance diputar ulang. Tekstur atmosfer dan aksen chrome global tidak membuat trigger per section. Semua copy tetap tersedia sebagai DOM text; animasi tidak membuka gate selain aksi Final Click.

- Preferensi sistem `prefers-reduced-motion` menghapus entrance yang tidak perlu.
- Jika sistem tidak meminta reduced motion, tersedia kontrol **Reduce motion / Enable motion**.
- Final Click tetap memerlukan aksi pengguna dalam semua mode; reduced motion hanya menghilangkan animasi reveal.
- Audio terpisah dari motion dan juga tidak memulai otomatis.
- GSAP context dibersihkan ketika view atau preferensi berubah.
- Efek visual tidak boleh membuat CTA tertutup atau memerlukan menunggu animasi untuk melanjutkan.

## Kewajiban review manual

Kode dan automated tests tidak menggantikan QA dengan keyboard, screen reader, browser zoom/text enlargement, viewport mobile/desktop, landscape, dan setting reduced motion. Periksa contrast champagne/muted pada ukuran teks kecil. Catat browser/perangkat yang benar-benar dipakai saat melaporkan hasil.
