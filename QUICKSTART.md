# Quick Start

1. Cài dependencies.

```bash
npm install
```

2. Tạo env.

```bash
cp .env.example .env.local
```

3. Điền biến môi trường trong `.env.local` (OAuth, Supabase, Cloudinary, admin).

4. Tạo schema trên Supabase (xem phần SQL trong `scripts/migrate-to-supabase.ts`).
   Nếu bảng `images` đã tồn tại, thêm cột `public_id`:

```sql
ALTER TABLE images ADD COLUMN IF NOT EXISTS public_id TEXT;
```

5. Chạy dev.

```bash
npm run dev
```

6. Truy cập admin tại `http://localhost:3000/admin/login`.
