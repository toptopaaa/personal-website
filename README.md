# TOPTOPAAA.COM

Website portofolio Moh. Nurul Mustofa berbasis Next.js App Router.

## Arsitektur gratis

- Frontend dan Worker: Cloudflare Workers melalui OpenNext
- Database: Cloudflare D1
- Penyimpanan gambar: Cloudflare R2
- Login admin: Cloudflare Zero Trust Access dengan Email One-Time PIN
- Repository: GitHub Free
- DNS dan HTTPS: Cloudflare

Tidak ada Supabase, Vercel, VPS, atau konfigurasi berbayar.

## Menjalankan lokal

Butuh Node.js 22 atau lebih baru.

```powershell
npm install
copy .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Menyiapkan D1

1. Buat database bernama `toptopaaa-production` di Cloudflare Dashboard.
2. Jalankan migration:

```powershell
npx wrangler d1 execute toptopaaa-production --file=./migrations/0001_projects.sql
```

Untuk database jarak jauh, tambahkan `--remote`.

3. Salin database ID ke `d1_databases.database_id` pada `wrangler.jsonc`.
4. Backup database:

```powershell
npx wrangler d1 export toptopaaa-production --remote --output=backup.sql
```

Simpan backup di tempat aman. Uji restore pada database cadangan sebelum dipakai.

## Menyiapkan R2

1. Buat bucket bernama `work`.
2. Hubungkan bucket ke binding `WORK` pada `wrangler.jsonc`.
3. Aktifkan custom public domain atau R2.dev.
4. Isi `R2_PUBLIC_BASE_URL` dengan URL HTTPS tanpa `/` di akhir.

## Menyiapkan Cloudflare Access

1. Buka **Zero Trust → Access → Applications**.
2. Buat application untuk `toptopaaa.com/admin*` dan `toptopaaa.com/api/admin/*`.
3. Aktifkan Email OTP.
4. Buat Allow Policy dengan email tepat `toptopaaa.id@gmail.com`.
5. Catat Application Audience (AUD).
6. Isi `CF_ACCESS_TEAM_DOMAIN` dan `CF_ACCESS_AUDIENCE` pada environment/secret Worker.

Access adalah lapisan keamanan pertama. Aplikasi juga memvalidasi JWT `Cf-Access-Jwt-Assertion` dan menolak email selain pemilik.

## Deployment Cloudflare

```powershell
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy
```

Arahkan custom domain `toptopaaa.com` ke Worker melalui Cloudflare. Jangan mengubah nameserver atau record lama tanpa memeriksa DNS yang ada.

Buka `/api/health`. Target respons HTTP 200 dan `"ok": true`.

## Memakai dashboard

1. Buka `https://toptopaaa.com/admin`.
2. Selesaikan Email OTP Cloudflare Access.
3. Tekan **Project baru**.
4. Isi cover, detail, overview, dan deliverables.
5. Tambahkan blok konten lalu tekan Simpan.
6. Isi alt text, overview, dan satu deliverables sebelum menerbitkan.
7. Pilih terbitkan sekarang atau jadwalkan dengan waktu WIB.

## Pemeriksaan

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
```

Catat hasil pengujian aktual setelah deployment preview. Jangan mengklaim hasil deployment atau Lighthouse tanpa bukti pengukuran.

## TODO pemilik

- Ganti `[CITY]` dengan kota domisili.
- Tambahkan URL Instagram jika tersedia.
- Ganti cover placeholder Lanbulan Online.
- Tambahkan project dan testimoni asli.
- Ganti favicon placeholder.
- Konfirmasi Figma dan AI-Powered Creative Tools.
- Verifikasi klaim brand identity, logo design, dan international clients.
- Isi database ID dan domain R2/public di konfigurasi produksi.

## Batas Free plan

- Workers Free: 100.000 request/hari.
- D1 Free: 500 MB dan batas operasi harian.
- R2 Free: 10 GB penyimpanan dan batas operasi bulanan.

Pantau penggunaan Cloudflare. Jangan mengaktifkan paket berbayar otomatis.
