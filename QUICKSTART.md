# Hướng Dẫn Bắt Đầu Nhanh (Quick Start)

Hướng dẫn này sẽ giúp bạn lên website chuyên gia xây dựng trong 5 phút.

## 1️⃣ Cài Đặt (1 phút)

```bash
# Cài đặt dependencies
npm install

# Tạo file environment
cp .env.example .env.local
```

## 2️⃣ Cấu Hình Google OAuth (2 phút)

Đây là bước quan trọng nhất!

### A. Tạo Google OAuth Credentials

1. Vào https://console.cloud.google.com/
2. Tạo project mới (nếu chưa có)
3. Vào **APIs & Services** → **Credentials**
4. Nhấp **"Create Credentials"** → **"OAuth client ID"** → **"Web application"**
5. Thêm vào **"Authorized JavaScript origins"**:
   - `http://localhost:3000`
   - (Nếu deploy: thêm `https://yourdomain.com`)
6. Thêm vào **"Authorized redirect URIs"**:
   - `http://localhost:3000/api/auth/callback/google`
   - (Nếu deploy: thêm `https://yourdomain.com/api/auth/callback/google`)
7. Sao chép **Client ID** và **Client Secret**

### B. Sửa .env.local

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
```

**Lấy NEXTAUTH_SECRET:**
```bash
npx auth-secret
```

## 3️⃣ Chỉnh Sửa Thông Tin Cá Nhân (1 phút)

Sửa file `/data/introduction.json`:

```json
{
  "fullName": "Tên của bạn",
  "title": "Chuyên Gia Xây Dựng",
  "specializations": ["Quản lý dự án", "BIM"],
  "bio": "Mô tả ngắn về bạn",
  "email": "your@email.com",
  "phone": "+84 xxx xxx xxx",
  "location": "TP. Hồ Chí Minh"
}
```

## 4️⃣ Chạy Website (1 phút)

```bash
npm run dev
```

Truy cập http://localhost:3000

## 5️⃣ Truy Cập Admin Panel

1. Vào http://localhost:3000/admin/login
2. Nhấp "Đăng Nhập Với Google"
3. Cho phép quyền truy cập
4. Bắt đầu quản lý nội dung!

## 📝 Thêm Kinh Nghiệm/Dự Án

### Từ Admin Panel:
- **Kinh Nghiệm**: Sidebar → Kinh Nghiệm → "Thêm Kinh Nghiệm"
- **Dự Án**: Sidebar → Dự Án → "Thêm Dự Án"
- **Mục Tiêu**: Sidebar → Mục Tiêu → "Thêm Mục Tiêu"

### Hoặc Sửa JSON Trực Tiếp:

**experience.json:**
```json
{
  "experiences": [
    {
      "id": 1,
      "position": "Quản lý Dự Án",
      "company": "Công ty ABC",
      "startDate": "2020-01",
      "endDate": null,
      "isCurrent": true,
      "description": "Mô tả công việc..."
    }
  ]
}
```

**projects.json:**
```json
{
  "projects": [
    {
      "id": 1,
      "title": "Dự Án Xây Dựng Tòa Nhà",
      "description": "Xây dựng tòa nhà 20 tầng...",
      "role": "Quản lý Dự Án",
      "duration": "2021-2022",
      "budget": "5 tỷ VND",
      "team": "50 người",
      "outcomes": ["Hoàn thành sớm 3 tháng", "Tiết kiệm 10% chi phí"]
    }
  ]
}
```

## 🌐 Deployment (Deploy Trực Tuyến)

### Vercel (Khuyên Dùng)

```bash
# Cài vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow các hướng dẫn
```

Hoặc:
1. Push code lên GitHub
2. Vào vercel.com → New Project
3. Import GitHub repository
4. Thêm environment variables
5. Nhấp Deploy

### Environment Variables Cho Production

Khi deploy, thay đổi:
```env
NEXTAUTH_URL=https://yourdomain.com
```

## ✅ Kiểm Tra

- [ ] Website hiển thị tại http://localhost:3000
- [ ] Admin login hoạt động
- [ ] Admin panel hiển thị
- [ ] Có thể thêm/sửa nội dung
- [ ] Contact form hoạt động

## 🆘 Nếu Gặp Lỗi

1. **"useSession must be wrapped in SessionProvider"**
   - Kiểm tra `.env.local` có `NEXTAUTH_SECRET` không
   - Thử restart dev server: Ctrl+C → `npm run dev`

2. **OAuth không hoạt động**
   - Kiểm tra `GOOGLE_ID` và `GOOGLE_SECRET` đúng
   - Kiểm tra redirect URI trong Google OAuth settings
   - Xóa cookies, thử incognito mode

3. **Admin page blank**
   - Xóa `.next` folder: `rm -rf .next`
   - Thử lại: `npm run dev`

4. **Giúp thêm**
   - Xem README.md phần "Xử Sự Cố"
   - Check browser console (F12)

## 📖 Tiếp Theo

- Xem README.md để hiểu thêm
- Tùy chỉnh màu sắc trong `app/globals.css`
- Cập nhật metadata SEO trong `app/layout.tsx`
- Deploy trên Vercel

---

**Chúc bạn thành công!** 🚀
