# Panduan Menulis Konten

Edit konfigurasi di [`src/content/story.ts`](../src/content/story.ts). Tidak ada dashboard atau editor konten runtime.

## Pengaturan umum

`storyConfig` menyimpan:

- `title`: judul tab/browser.
- `recipientName`: sapaan opsional. String kosong menghasilkan **Hey, you.**.
- `senderName`: tanda tangan opsional; string kosong memakai tanda tangan netral.
- `dedication`: kalimat kecil di footer hero.
- `visuals.orbitalAccent` dan `visuals.grain`: mengaktifkan aksen orbit/grain global.
- `labels.begin`, `labels.reveal`, dan `labels.replay`: label aksi yang dipakai alur saat ini.
- `scenes`: urutan seluruh scene.

`labels.continue` dan `labels.back` masih ada di konfigurasi awal, tetapi tidak menjadi navigasi chapter pada flow hybrid saat ini.

## Field umum scene

| Field | Wajib | Aturan |
| --- | --- | --- |
| `id` | Ya | String non-kosong dan unik di seluruh daftar. Pakai ID stabil, pendek, huruf kecil, dan tanda hubung. |
| `type` | Ya | `invitation`, `narrative`, `confession`, atau `closing`. |
| `label` | Ya | Eyebrow pendek yang terlihat di atas heading. |
| `heading` | Ya | Headline scene. |
| `emphasis` | Tidak | Baris headline kedua yang ditampilkan sebagai italic/aksen. |
| `continueLabel` | Tidak | Override CTA hero untuk invitation. |
| `revealLabel` | Tidak | Override tombol Final Click untuk confession. |

## Jenis scene

### Invitation

Harus berada di posisi pertama dan memiliki `body`.

```ts
{
  id: 'invitation',
  type: 'invitation',
  label: 'A little something for you',
  heading: 'Some things are',
  emphasis: 'worth saying.',
  body: 'A little story.\nA few honest words.',
}
```

### Narrative

Gunakan salah satu layout `editorial`, `fragments`, `quotation`, `realization`, atau `quiet`. `fragments` harus berisi minimal satu string non-kosong. Semua fragmen scene narrative tersedia untuk dibaca saat story dimulai; GSAP menganimasikan entrance saat pembaca scroll. Fragmen tidak memerlukan klik satu per satu.

```ts
{
  id: 'little-things',
  type: 'narrative',
  layout: 'fragments',
  label: 'The little things',
  heading: "It's the little things",
  emphasis: 'that stay.',
  fragments: [
    'The way you make ordinary moments feel lighter.',
    'The conversations I did not want to end.',
    'The kindness you probably do not even notice.',
  ],
}
```

### Confession

Harus muncul setelah invitation dan sebelum closing. Hanya ada satu. `introduction` tampil sebelum reveal, `confession` adalah kalimat yang digerbang, `supporting` tampil setelahnya.

```ts
{
  id: 'confession',
  type: 'confession',
  label: 'One last thing',
  heading: 'A little courage.',
  emphasis: 'One honest sentence.',
  introduction: 'There is something I want you to know.',
  confession: 'I like you.',
  supporting: 'I just wanted to be honest about how I feel.',
}
```

Jangan pindahkan teks utama confession ke heading, introduction, dekorasi, label, atau copy sebelum Final Click. Nilai `confession` sendiri tidak dimasukkan ke UI hingga reveal, tetapi tetap menjadi source code publik di bundle situs.

### Closing

Harus menjadi scene terakhir dan memiliki `body`. Isi perlu menerima berbagai kemungkinan perasaan tanpa meminta balasan.

## Invarian daftar scene

- Tepat satu invitation di indeks pertama.
- Tepat satu confession setelah invitation dan sebelum closing.
- Tepat satu closing di posisi terakhir.
- Semua `id` unik.
- Narrative scene memiliki layout yang didukung dan setidaknya satu fragment.
- Jumlah dan progress dihitung dari array aktual; jangan menulis `1 / 8` statis pada komponen.

Invalid scene opsional dan ID duplikat dilewati. Jika struktur role wajib rusak, aplikasi memakai tiga fallback scene. Ini bukan pengganti validasi build untuk kesalahan sintaks/tipe TypeScript.

## Copy dan karakter

- Teks untuk penerima wajib berbahasa Inggris.
- Gunakan kalimat alami, spesifik, tulus, dan gentle.
- Hindari janji, rasa bersalah, ultimatum, asumsi atas perasaan penerima, atau tekanan untuk merespons.
- Gunakan apostrof, tanda kutip, dan baris baru langsung sebagai string TypeScript. React meng-escape teks biasa; jangan memasukkan string ke `dangerouslySetInnerHTML`.
- Uji headline/nama panjang dan body dengan baris baru agar tidak tertutup ornamen atau kontrol.
