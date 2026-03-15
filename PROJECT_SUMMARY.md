# Project Summary

## Tổng Quan

Website portfolio cho lĩnh vực xây dựng, gồm public site và admin panel. Dữ liệu lưu trên Supabase, ảnh lưu trên Cloudinary.

## Kiến Trúc

- Frontend: Next.js App Router, React, Tailwind.
- Auth: NextAuth (Google/GitHub).
- Data: Supabase (bảng `introduction`, `experience`, `projects`, `goals`, `images`, `inquiries`).
- Media: Cloudinary, lưu `public_id` trong bảng `images` để xóa đồng bộ.

## Triển Khai

- Vercel + env vars đầy đủ.
- `NEXTAUTH_URL` trỏ domain production.
- Supabase schema đã tạo và có cột `images.public_id`.
