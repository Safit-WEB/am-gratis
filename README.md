# Bagi AM Gratis

Website sederhana untuk bagikan **Alight Motion Premium** gratis, terintegrasi dengan API [premku.com](https://premku.com).

## Fitur

- ✅ 2 metode: **Email Sendiri** (Buy Single) & **Akun Siap Pakai** (Buy Bulk)
- ✅ Gerbang iklan (wajib klik / tunggu countdown) sebelum claim
- ✅ API Key aman (hanya di server / Vercel Environment)
- ✅ UI modern & mobile-friendly
- ✅ Siap deploy ke Vercel gratis

## Cara Deploy ke Vercel

1. Push project ini ke GitHub (buat repo baru)
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → Import repo
3. Di **Environment Variables**, tambahkan:
   ```
   PREMKU_API_KEY = (api key kamu dari dashboard premku)
   ```
4. Klik **Deploy**

Setelah deploy, website langsung hidup.

## Setup Iklan (Penting untuk Balik Modal)

Di file `app/page.js` dan `app/layout.js` ada placeholder iklan.

### Opsi yang direkomendasikan:
- **Google AdSense** (paling stabil)
- **PropellerAds / PopAds** (high CPM)
- **Affiliate link** (shopee, tokopedia, atau produk digital)

Ganti bagian `adBox` dengan kode iklan kamu, atau ubah `handleAdClick` supaya buka link affiliate.

## Development Lokal

```bash
npm install
cp .env.example .env.local
# edit .env.local isi PREMKU_API_KEY
npm run dev
```

Buka http://localhost:3000

## Catatan Keamanan

- Jangan pernah expose `PREMKU_API_KEY` di frontend
- Semua request ke premku lewat `/api/am` (server-side)
- Batasi qty Buy Bulk (saat ini max 5) supaya saldo tidak cepat habis

## Support

Website ini pure frontend + 1 API route. Bisa dikembangkan lagi (rate limit IP, database history, dll).
