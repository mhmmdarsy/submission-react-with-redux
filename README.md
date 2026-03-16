# Forum Diskusi - Submission React with Redux

Aplikasi forum diskusi berbasis Next.js App Router dan Redux Toolkit.

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

## Automation Testing

Perintah pengujian yang wajib digunakan:

```bash
npm test
npm run e2e
```

Cakupan test pada proyek ini:

- Unit test reducer (`threadsSlice`)
- Unit/integration test thunk (`loginThunk`, `voteThreadThunk`)
- Component test React (`LoginForm`, `Navbar`)
- End-to-end test alur login (`cypress/e2e/login.cy.ts`)

Setiap berkas pengujian sudah memuat skenario pengujian pada komentar di bagian atas file.

## CI/CD

### Continuous Integration (GitHub Actions)

Workflow CI berada di `.github/workflows/ci.yml` dengan alur berikut:

1. Install dependencies
2. Jalankan lint
3. Jalankan unit dan integration test (`npm test`)
4. Jalankan E2E test Cypress (`npm run e2e`)

### Continuous Deployment (Vercel)

Deployment dilakukan menggunakan Vercel.

Isi URL deployment setelah deploy:

`Vercel URL: <isi-url-deployment-anda-di-sini>`

## Branch Protection

Konfigurasi branch protection dilakukan pada branch `master` dengan minimal:

- Require status checks to pass before merging
- Require review sebelum merge

## Bukti Screenshot Submission

Letakkan screenshot bukti pada folder `screenshot/` dengan nama berkas berikut:

- `1_ci_check_error.png`
- `2_ci_check_pass.png`
- `3_branch_protection.png`

Struktur folder dalam ZIP submission:

```text
submission-react-with-redux-part2/
	screenshot/
		1_ci_check_error.png
		2_ci_check_pass.png
		3_branch_protection.png
	...
```

## React Ecosystem yang Digunakan

Proyek memanfaatkan ekosistem React di luar daftar yang dikecualikan, yaitu:

- Next.js App Router
- Radix UI (`@radix-ui/react-select`)
