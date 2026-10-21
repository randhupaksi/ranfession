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

## Build dan publikasi statis

```powershell
npm ci
npm run build
npm run preview
```

Build menghasilkan `dist/`. Upload isi direktori itu ke hosting statis pilihan. Vite memakai root path default dan belum memiliki konfigurasi deployment khusus/base path. Aplikasi tidak membutuhkan database, backend, secret, atau environment variable.

Situs memerlukan JavaScript; pesan `noscript` disediakan untuk pengunjung yang menonaktifkannya. Pastikan host menggunakan fallback dokumen utama untuk URL root dan mengirim file aset hasil build dengan benar.
