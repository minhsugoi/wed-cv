# Portfolio Website (Construction)

Trang portfolio + admin panel để quản lý nội dung (Supabase) và ảnh (Cloudinary).

## Yêu Cầu

1. Node.js 18+.
2. Tài khoản Supabase.
3. Tài khoản Cloudinary.
4. OAuth Google hoặc GitHub cho admin login.

## Cài Đặt Local

1. Cài dependencies.

```bash
npm install
```

2. Tạo file env.

```bash
cp .env.example .env.local
```

3. Điền biến môi trường trong `.env.local`.

Các biến cần có:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_ID`, `GOOGLE_SECRET` (hoặc GitHub)
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER` (tùy chọn)

4. Tạo schema trên Supabase.

Trong `scripts/migrate-to-supabase.ts` có phần SQL schema. Chạy SQL này trên Supabase SQL Editor.
Nếu đã có bảng `images`, đảm bảo có cột `public_id`.

```sql
ALTER TABLE images ADD COLUMN IF NOT EXISTS public_id TEXT;
```

5. Chạy dev.

```bash
npm run dev
```

## Dữ Liệu & Ảnh

- Dữ liệu nội dung nằm trong Supabase.
- Ảnh upload được lưu trên Cloudinary và `public_id` được lưu vào bảng `images`.
- Khi xóa ảnh khỏi kho trong admin, ảnh trên Cloudinary sẽ được xóa theo `public_id`.

## Triển Khai (Vercel)

1. Push code lên GitHub.
2. Import repo vào Vercel.
3. Thêm toàn bộ biến môi trường từ `.env.local` vào Vercel.
4. Cập nhật `NEXTAUTH_URL` thành domain production.
5. Deploy.

Nếu gặp lỗi `column images.public_id does not exist`, hãy đảm bảo schema Supabase đã cập nhật.

## Ghi Chú Bảo Mật

- Không commit `.env.local`.
- Dùng secret mạnh cho `NEXTAUTH_SECRET` và `ADMIN_PASSWORD`.
- Đổi các key khi cần.
