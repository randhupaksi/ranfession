# Audio, Privasi, dan Deployment

## Audio ambient

Implementasi berada di `src/hooks/useAmbience.ts`; kontrolnya di `src/components/SoundControl.tsx`.

- Keadaan awal selalu **Sound off**. `AudioContext` baru dibuat setelah klik/tap pengunjung.
- Audio procedural terdiri dari filtered noise texture, nada sinus ber-volume rendah, dan modulasi lambat. Tidak ada vokal, musik berhak cipta, atau audio file yang diunduh.
- Volume awal rendah dan dapat disesuaikan ketika audio aktif.
- Perubahan gain memakai fade. Mute menjadwalkan suspend; tab tersembunyi men-suspend graph.
- Graph dipakai ulang saat toggle, lalu source/context ditutup ketika komponen dilepas.
- Jika AudioContext tidak didukung, resume gagal, atau browser membatasi audio, status menjadi unavailable dan cerita tetap bisa dibaca hening.

Periksa suara melalui speaker/headphone nyata sebelum menyebut kualitasnya terverifikasi. Tipe perangkat, browser, volume sistem, dan output audio memengaruhi hasil.

## Privasi dan akses publik

- Tidak ada backend aplikasi, akun, database, form jawaban, analytics penerima, read receipt, atau pengiriman data cerita ke API.
- Progress berada di React state dan hilang saat halaman di-refresh. Aplikasi tidak menyimpan preferensi/audio atau identitas ke storage.
- Isi cerita dan nama yang dikonfigurasi menjadi bagian aset website yang diunduh browser; Final Click adalah kontrol presentasi, bukan enkripsi.
- `robots` bernilai `noindex, nofollow` sebagai permintaan mesin pencari saat persiapan. Siapa pun yang memiliki URL tetap dapat membuka situs.
- Penyedia hosting dapat memiliki log/infrastruktur sendiri; hal itu di luar kode aplikasi dan belum ditentukan.
- Hindari mengisi konten dengan detail rahasia, alamat, data kontak, atau informasi pihak ketiga yang tidak diizinkan.

## Build dan publikasi ke Vercel

```powershell
npm ci
npm run build
npm run preview
```

Build menghasilkan `dist/`. [`vercel.json`](../vercel.json) menyatakan framework Vite, perintah install/build, dan direktori output statis tersebut. Aplikasi tidak membutuhkan database, backend, secret, atau environment variable. Vercel menyediakan Node.js 24 sebagai versi default untuk project baru dan mendukung deployment Vite; CI project ini juga memakai Node.js 24. [Dokumentasi Vercel: Vite](https://vercel.com/docs/frameworks/frontend/vite), [versi Node.js Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

Untuk CI/CD, import repository GitHub ke project Vercel dan aktifkan integrasi Git. Push/PR dapat memicu deployment preview, lalu perubahan pada production branch memicu deployment produksi sesuai konfigurasi branch project. [Dokumentasi Vercel tentang integrasi Git](https://vercel.com/docs/deployments/git).

### Setup Vercel pertama kali

1. Di Vercel, import repository `randhupaksi/ranfession` dari GitHub dan gunakan root repository sebagai Root Directory.
2. Gunakan branch `main` sebagai production branch dan Node.js `24.x`. Vercel membaca build/output dari `vercel.json`; tidak ada environment variable aplikasi.
3. Untuk alur yang menunggu pemeriksaan, buat pull request, tunggu GitHub Actions lulus, periksa deployment preview, lalu merge ke `main`. Push langsung ke `main` dapat memulai deployment produksi sebelum workflow selesai. Untuk mewajibkan CI lulus sebelum perubahan masuk ke `main`, aktifkan required status checks dan kewajiban pull request di branch protection/ruleset GitHub; pengaturan remote itu tidak dibuat oleh berkas repository ini.

Sebelum deployment publik, personalisasi konten `src/content/story.ts`: seluruh isi situs yang dibuild dapat dilihat oleh siapa pun yang memiliki URL. Jalankan GitHub Actions sampai lulus dan periksa deployment preview sebelum memakai URL publik.

Situs memerlukan JavaScript; pesan `noscript` disediakan untuk pengunjung yang menonaktifkannya. Pastikan host menggunakan fallback dokumen utama untuk URL root dan mengirim file aset hasil build dengan benar.
