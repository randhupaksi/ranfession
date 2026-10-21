# Claude Code — Ranfession

Baca [`AGENTS.md`](AGENTS.md) sebelum mengubah kode. AGENTS.md adalah aturan kanonis untuk produk, batas implementasi, aksesibilitas, verifikasi, dan Git; jangan membuat instruksi yang bertentangan.

Dokumen produk dan teknis yang lebih rinci:

- [`docs/product-overview.md`](docs/product-overview.md) untuk visi dan alur terkini.
- [`docs/requirements-traceability.md`](docs/requirements-traceability.md) untuk pemetaan PRD dan perbedaan yang telah diputuskan.
- [`docs/architecture.md`](docs/architecture.md) untuk modul dan batas sistem.
- [`docs/content-authoring.md`](docs/content-authoring.md) untuk konfigurasi scene.
- [`docs/interaction-accessibility-motion.md`](docs/interaction-accessibility-motion.md) untuk scroll, Final Click, fokus, dan motion.
- [`docs/audio-privacy-deployment.md`](docs/audio-privacy-deployment.md) untuk audio, privasi, serta hosting.
- [`docs/verification.md`](docs/verification.md) untuk pemeriksaan dan skenario QA.

Keputusan navigasi saat ini: pembuka berupa hero satu layar, kemudian narasi dibaca dengan scroll native. Copy naratif tidak dikunci satu per satu lewat tombol. Confession tetap tersembunyi sampai pengunjung menekan **Reveal**. Jangan menambah mekanisme balasan atau tracking.
