# Gambaran Produk

## Sumber dan status keputusan

Dokumen kebutuhan awal adalah `PRD_Confession_Codex_Versi_Baru.docx`, versi 1.0, “Final Creative Direction”. PRD menetapkan identitas, batas produk, nada, prinsip privasi, audio, aksesibilitas, dan acceptance criteria.

Setelah PRD dibuat, pemilik produk memilih alur campuran: layar pertama hanya hero pembuka tanpa scroll; setelah **Begin**, cerita berlanjut dalam halaman native scroll. Keputusan terbaru ini menggantikan aturan PRD yang mengusulkan click-to-reveal pada setiap fragmen dan chapter sebagai alur utama. Batas lain dalam PRD tetap berlaku kecuali pengguna memberi arahan baru. Pemetaan rinci ada di [`requirements-traceability.md`](requirements-traceability.md).

## Visi

Ranfession adalah hadiah digital berbentuk surat personal. Ia memberi pengirim ruang untuk menyampaikan satu perasaan dengan jujur, lalu memberi penerima kebebasan untuk merasakan apa pun tanpa kewajiban membalas.

Pengalaman harus terasa tenang, matang, personal, dan sedikit misterius. Nilainya datang dari ritme cerita, copy, tipografi, komposisi, dan interaksi yang disengaja.

## Pengguna dan akses

- **Pengirim:** mengubah konfigurasi teks sebelum situs dipublikasikan.
- **Penerima:** membaca dari link publik, sering kali lewat browser ponsel; tidak perlu akun.
- **Pengunjung lain:** siapa pun yang memperoleh URL dapat membuka situs. Konten tidak privat secara teknis.

## Alur saat ini

1. **Invitation:** hero satu layar berisi sapaan, headline, copy pendek, dan tombol **Begin**.
2. **Story:** Begin membuka halaman cerita yang memakai native vertical scrolling. Chapter punya komposisi visual berbeda. Copy tersedia tanpa klik per fragmen; GSAP menambahkan gerak saat konten mendekati viewport.
3. **Confession pending:** pembaca dapat scroll sampai chapter confession. Kalimat utamanya belum dirender sebagai teks visual sebelum tombol **Reveal** ditekan.
4. **Final Click:** tombol Reveal menjadi tindakan eksplisit untuk mengungkap pengakuan. Jika motion dikurangi, isi muncul tanpa animasi panjang tetapi tindakan Reveal tetap diperlukan.
5. **Closing:** setelah reveal, penutup tersedia dengan pesan yang tidak meminta jawaban serta tombol **Read again**.

Wordmark membawa pembaca kembali ke opening. Membaca ulang chapter sebelumnya dilakukan dengan scroll ke atas atau anchor yang tersedia. Refresh memulai sesi journey dari opening.

## Identitas visual

- Tema: **Midnight Elegance**.
- Palet dasar: charcoal `#101013`, warm dark `#29252A`, champagne `#BDA990`, ivory `#F0E8DF`.
- Tipografi: serif elegan untuk headline/nada personal dan sans-serif bersih untuk label/UI.
- Copy visitor-facing: Full English, sincere and gentle.
- Komposisi bersifat editorial dan bervariasi. Dekorasi boleh memperkuat suasana, tetapi tidak boleh mengaburkan copy atau membebani perangkat.
- Pengalaman tidak memerlukan gambar, video, atau musik eksternal.

## Termasuk dalam cakupan

- Konfigurasi konten terpusat dan urutan scene fleksibel.
- Hero, cerita scroll, gerbang Final Click, closing, dan replay.
- Progress sesuai scene aktual, anchor, dukungan keyboard, dan responsif.
- Audio ambient sintetis yang diam secara default dan opsional.
- Reduced motion dan fallback saat audio atau konfigurasi tidak tersedia.

## Di luar cakupan

Login, akun multi-user, dashboard admin, database/inbox pesan, komentar, form balasan, tombol Yes/No, chat untuk menagih balasan, read receipt, analitik personal, notifikasi pengirim, upload media, gamification, dan fitur berbayar.

## Prinsip pengalaman

- Pembaca menentukan kapan memulai, kapan membuka confession, kapan menyalakan audio, dan kapan keluar.
- Tidak ada aksi yang memanipulasi atau menekan penerima.
- Cerita harus tetap jelas tanpa suara, animasi, atau aset eksternal.
- Tidak ada teks penting yang terpotong demi mempertahankan tinggi satu layar.
- Website publik tidak boleh dipasarkan sebagai rahasia atau terlindungi.
