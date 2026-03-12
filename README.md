# Hồ Sơ Chuyên Gia Xây Dựng - Professional Portfolio Website

Một trang web hồ sơ chuyên gia toàn diện được thiết kế cho những chuyên gia trong ngành xây dựng, được xây dựng bằng Next.js 15, TypeScript, Tailwind CSS v4, và NextAuth.js. Gồm trang web công khai chuyên nghiệp và admin panel bảo mật để quản lý nội dung.

## ✨ Tính Năng

### 🌐 Trang Web Công Khai
- **Trang Chủ (Home)**: Hero section với giới thiệu, chuyên môn, thông tin liên lạc và CTA
- **Kinh Nghiệm**: Timeline kinh nghiệm làm việc với chi tiết công ty, vị trí, mô tả
- **Dự Án**: Showcase các dự án hoàn thành với ảnh, mô tả, vai trò, ngân sách, kết quả
- **Mục Tiêu Sự Nghiệp**: Mục tiêu phát triển, timeline, kế hoạch dài hạn
- **Liên Hệ**: Form liên hệ toàn diện với validatation, lưu trữ yêu cầu tự động
- **Header & Footer**: Navigation tối ưu với responsive design
- **Responsive Design**: Mobile-first, hoạt động tốt trên mọi thiết bị

### 🔐 Admin Panel Bảo Mật
- **Xác Thực OAuth**: Đăng nhập an toàn via Google hoặc GitHub
- **Email Whitelist**: Tuỳ chọn giới hạn admin access đến email cụ thể
- **Dashboard**: Tổng quan nhanh với số liệu thống kê
- **Quản Lý Nội Dung**: CRUD interfaces toàn diện cho:
  - Thông tin giới thiệu cá nhân
  - Kinh nghiệm làm việc (thêm/sửa/xóa)
  - Dự án (thêm/sửa/xóa)
  - Mục tiêu sự nghiệp (thêm/sửa/xóa)
- **Quản Lý Yêu Cầu**: Xem, quản lý, xóa yêu cầu từ khách hàng
- **Sidebar Navigation**: Menu admin tiện lợi với icons
- **Auto-save**: Tất cả thay đổi được lưu tự động

## 🛠️ Công Nghệ & Thư Viện

- **Next.js 15**: React framework với App Router
- **TypeScript**: Typage an toàn cho JavaScript
- **Tailwind CSS 4**: Styling utility-first
- **NextAuth.js**: Xác thực OAuth
- **Lucide React**: Biểu tượng SVG
- **React Hook Form**: Xử lý biểu mẫu
- **Zod**: Xác thực schema
- **Sonner**: Thông báo toast

## 📁 Cấu Trúc Dự Án

```
.
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/       # NextAuth handler
│   │   ├── data/                      # API cho lưu/tải dữ liệu
│   │   └── contact/                   # API xử lý liên hệ
│   ├── admin/
│   │   ├── login/                     # Trang đăng nhập
│   │   ├── dashboard/                 # Bảng điều khiển chính
│   │   └── edit/                      # Các trang chỉnh sửa nội dung
│   │       ├── introduction/
│   │       ├── experience/
│   │       ├── projects/
│   │       └── goals/
│   ├── experience/                    # Trang kinh nghiệm công khai
│   ├── projects/                      # Trang dự án công khai
│   ├── goals/                         # Trang mục tiêu công khai
│   ├── contact/                       # Trang liên hệ công khai
│   ├── page.tsx                       # Trang chủ
│   ├── layout.tsx                     # Root layout
│   └── globals.css                    # CSS toàn cầu
├── components/
│   ├── header.tsx                     # Header navigation
│   ├── footer.tsx                     # Footer
│   └── ui/                            # Shadcn/ui components
├── data/
│   ├── introduction.json              # Dữ liệu giới thiệu
│   ├── experience.json                # Dữ liệu kinh nghiệm
│   ├── projects.json                  # Dữ liệu dự án
│   ├── goals.json                     # Dữ liệu mục tiêu
│   └── inquiries.json                 # Dữ liệu yêu cầu liên hệ
├── lib/
│   ├── auth.ts                        # Cấu hình NextAuth
│   └── utils.ts                       # Utility functions
└── public/                            # Tệp tĩnh
```

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống
- **Node.js**: 18.17 trở lên
- **npm**: 9+ hoặc **pnpm** 8+
- **Git**: Cho việc deploy (tuỳ chọn)

### Cài Đặt Dự Án Cục Bộ

#### 1. Cài đặt Dependencies
```bash
npm install
```

#### 2. Tạo Environment Variables
```bash
cp .env.example .env.local
```

Sửa `.env.local` với các giá trị của bạn (xem phần Thiết Lập OAuth bên dưới).

#### 3. Chạy Development Server
```bash
npm run dev
```

Website sẽ chạy tại **http://localhost:3000**

#### 4. Truy Cập Admin Panel
- Vào http://localhost:3000/admin/login
- Đăng nhập với Google hoặc GitHub
- Bắt đầu quản lý nội dung

### Environment Variables Cần Thiết

```env
# REQUIRED: NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here

# REQUIRED: At least one OAuth provider
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# OPTIONAL: GitHub OAuth
GITHUB_ID=your_github_client_id  
GITHUB_SECRET=your_github_client_secret

# OPTIONAL: Restrict admin to specific emails (comma-separated)
# AUTHORIZED_EMAILS=admin@example.com,trusted@example.com
```

**Tạo NEXTAUTH_SECRET:**
```bash
npx auth-secret
```

## 🔐 Thiết Lập OAuth

Chọn ít nhất một provider (Google hoặc GitHub). **Google được khuyến nghị** vì dễ set up hơn.

### Option 1: Google OAuth (Recommended)

#### Development Setup:
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. **Tạo Project Mới**:
   - Nhấp dropdown project ở top
   - Nhấp "New Project"
   - Đặt tên (ví dụ: "Portfolio Xây Dựng")
   - Nhấp "Create"

3. **Tạo OAuth Client ID**:
   - Vào "APIs & Services" → "Credentials"
   - Nhấp "Create Credentials" → "OAuth client ID"
   - Chọn "Web application"
   - Thêm "Authorized JavaScript origins":
     - `http://localhost:3000`
     - `http://localhost:3001` (nếu cần port khác)
   - Thêm "Authorized redirect URIs":
     - `http://localhost:3000/api/auth/callback/google`

4. **Lấy Credentials**:
   - Sao chép **Client ID**
   - Nhấp icon mắt, sao chép **Client Secret**

5. **Thêm vào .env.local**:
```env
GOOGLE_ID=your_client_id_here
GOOGLE_SECRET=your_client_secret_here
```

#### Production Setup (Vercel):
- Thêm production domain vào "Authorized JavaScript origins": `https://yourdomain.com`
- Thêm redirect URI: `https://yourdomain.com/api/auth/callback/google`
- Update `.env.local` hoặc Vercel Environment Variables

### Option 2: GitHub OAuth

#### Development Setup:
1. Vào [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Nhấp "New OAuth App"
3. Điền thông tin:
   - **Application name**: "Portfolio Chuyên Gia Xây Dựng"
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Sao chép **Client ID**
5. Nhấp "Generate a new client secret", sao chép **Client Secret**
6. Thêm vào `.env.local`:
```env
GITHUB_ID=your_client_id_here
GITHUB_SECRET=your_client_secret_here
```

#### Production Setup:
- Tạo OAuth App mới cho production
- **Homepage URL**: `https://yourdomain.com`
- **Authorization callback URL**: `https://yourdomain.com/api/auth/callback/github`
- Update environment variables trên Vercel

### Email Whitelist (Tuỳ Chọn)

Để chỉ cho phép admin access từ email cụ thể, thêm vào `.env.local`:
```env
AUTHORIZED_EMAILS=your@email.com,another@email.com
```

## 📝 Quản Lý Nội Dung

### Truy Cập Admin Panel

1. Vào **http://localhost:3000/admin/login** (hoặc https://yourdomain.com/admin/login)
2. Nhấp "Đăng Nhập Với Google" hoặc "Đăng Nhập Với GitHub"
3. Cho phép quyền truy cập
4. Được chuyển hướng đến Admin Dashboard

### Cập Nhật Nội Dung

#### 🏠 Trang Chủ (Giới Thiệu)
**Đường dẫn**: Admin Dashboard → Sidebar → Giới Thiệu

Cập nhật:
- Họ và tên
- Chức vụ/title
- Chuyên môn (tags)
- Tiểu sử (bio)
- Email liên lạc
- Số điện thoại
- Địa chỉ/vị trí

#### 💼 Kinh Nghiệm Làm Việc
**Đường dẫn**: Admin Dashboard → Sidebar → Kinh Nghiệm

Tính năng:
- **Thêm mới**: Nhấp "Thêm Kinh Nghiệm"
- **Sửa**: Click vào bản ghi để chỉnh sửa
- **Xóa**: Nhấp icon trash

Cập nhật:
- Vị trí công việc
- Tên công ty
- Ngày bắt đầu/kết thúc
- Công việc hiện tại? (checkbox)
- Mô tả chi tiết

#### 🏢 Dự Án
**Đường dẫn**: Admin Dashboard → Sidebar → Dự Án

Tính năng:
- **Thêm dự án mới**: Nhấp "Thêm Dự Án"
- **Sửa chi tiết**: Chỉnh sửa trường
- **Thêm kết quả**: Nhấp "Thêm Kết Quả"
- **Xóa**: Nhấp icon trash

Cập nhật:
- Tên dự án
- Mô tả chi tiết
- Vai trò của bạn
- Thời gian thực hiện
- Ngân sách dự án
- Kích thước đội
- Kết quả đạt được (multiple)

#### 🎯 Mục Tiêu Sự Nghiệp
**Đường dẫn**: Admin Dashboard → Sidebar → Mục Tiêu

Tính năng:
- **Thêm mục tiêu**: Nhấp "Thêm Mục Tiêu"
- **Sửa**: Chỉnh sửa trường
- **Xóa**: Nhấp icon trash

Cập nhật:
- Tiêu đề mục tiêu
- Mô tả chi tiết
- Timeline/Giai đoạn

#### 📧 Quản Lý Yêu Cầu Liên Hệ
**Đường dẫn**: Admin Dashboard → Sidebar → Liên Hệ

Xem:
- Tất cả yêu cầu từ khách hàng
- Tên, email, số điện thoại, tin nhắn
- Thời gian gửi

Quản lý:
- **Xóa yêu cầu**: Nhấp icon trash để xóa đã xử lý
- Yêu cầu được lưu tự động khi khách gửi form

## 🌐 Deployment (Triển Khai)

### Option 1: Vercel (Recommended)

Vercel là nền tảng tốt nhất để deploy Next.js apps. Nó free, nhanh, và tích hợp tốt với GitHub.

#### Method A: GitHub + Vercel (Easiest)

1. **Push code lên GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**:
   - Vào [vercel.com](https://vercel.com)
   - Nhấp "New Project"
   - Chọn "Import Git Repository"
   - Chọn GitHub repo của bạn

3. **Cấu Hình Environment Variables**:
   - Vercel sẽ hỏi environment variables
   - Thêm các biến từ `.env.local`:
     - `NEXTAUTH_URL` = `https://yourdomain.vercel.app` (hoặc custom domain)
     - `NEXTAUTH_SECRET` = (giữ nguyên hoặc tạo mới)
     - `GOOGLE_ID`, `GOOGLE_SECRET` (nếu dùng Google)
     - `GITHUB_ID`, `GITHUB_SECRET` (nếu dùng GitHub)

4. **Deploy**:
   - Nhấp "Deploy"
   - Vercel sẽ build và deploy tự động

#### Method B: Vercel CLI

```bash
# Cài vercel CLI
npm install -g vercel

# Deploy từ project folder
vercel

# Follow prompts để cấu hình
```

### Option 2: Netlify

Netlify cũng hỗ trợ Next.js tốt:

1. Đẩy code lên GitHub
2. Vào [netlify.com](https://netlify.com)
3. Nhấp "New site from Git"
4. Chọn repository
5. Cấu hình build settings và deploy

### Option 3: Self-Hosted (Nâng Cao)

Để deploy lên server riêng:

1. **Build Production**:
```bash
npm run build
```

2. **Start Production Server**:
```bash
npm run start
```

3. **Cấu hình Reverse Proxy** (Nginx/Apache)
4. **SSL Certificate** (Let's Encrypt)
5. **Process Manager** (PM2)

## 💾 Lưu Trữ Dữ Liệu

Dữ liệu được lưu trữ dưới dạng **JSON files** trong thư mục `data/`:
- `introduction.json` - Thông tin cá nhân
- `experience.json` - Lịch sử công việc
- `projects.json` - Dự án hoàn thành
- `goals.json` - Mục tiêu sự nghiệp
- `inquiries.json` - Yêu cầu liên hệ

**Sao lưu dữ liệu**: Sao chép thư mục `data/` định kỳ để đảm bảo an toàn.

**Migration**: Nếu chuyển sang database khác (MongoDB, PostgreSQL, etc.), cập nhật API routes trong `app/api/`.

## 🎨 Tùy Chỉnh Thiết Kế

### Màu Sắc (Theme Colors)

Các màu được định nghĩa trong `app/globals.css` sử dụng CSS variables:

**Màu Sáng (Light Mode)**:
```css
--primary: oklch(0.4 0.15 260);          /* Xanh lam chính */
--secondary: oklch(0.92 0.02 260);       /* Xám nhẹ */
--accent: oklch(0.35 0.18 260);          /* Xanh đậm */
--background: oklch(0.99 0.001 247);     /* Nền trắng */
--foreground: oklch(0.15 0.01 247);      /* Chữ tối */
```

**Màu Tối (Dark Mode)**:
```css
--primary: oklch(0.65 0.18 260);         /* Xanh sáng */
--background: oklch(0.12 0.01 245);      /* Nền tối */
--foreground: oklch(0.95 0.005 250);     /* Chữ sáng */
```

Để đổi màu, sửa giá trị OKLch trong `app/globals.css`.

### Font (Fonts)

Thiết lập trong `app/layout.tsx`:
- **Geist**: Font chính cho body text
- **Geist Mono**: Font cho code blocks

Để đổi font:
1. Sửa import trong `app/layout.tsx`
2. Cập nhật `@theme` trong `app/globals.css`

### Responsive Design

Website sử dụng Tailwind CSS breakpoints:
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+
- **2xl**: 1536px+

Tất cả components đã tối ưu responsive.

## 🔒 Bảo Mật

- ✅ **OAuth Authentication**: Không lưu mật khẩu, dùng Google/GitHub
- ✅ **Session Protection**: Các route /admin được bảo vệ
- ✅ **Email Whitelist**: Tuỳ chọn giới hạn admin access
- ✅ **CSRF Protection**: NextAuth tự động xử lý
- ✅ **HTTPS**: Bắt buộc trên production
- ✅ **.env.local**: Không commit vào Git (trong .gitignore)

**Best Practices**:
- Không share NEXTAUTH_SECRET
- Kiểm tra AUTHORIZED_EMAILS nếu dùng email whitelist
- Update OAuth Client Secrets định kỳ
- Monitor admin access logs

## 📞 Xử Sự Cố (Troubleshooting)

### Lỗi: "useSession must be wrapped in SessionProvider"
**Giải pháp**: Kiểm tra `components/providers.tsx` đã wrap root layout

### OAuth không hoạt động
- Kiểm tra `GOOGLE_ID`, `GOOGLE_SECRET` đúng
- Kiểm tra `NEXTAUTH_URL` khớp domain
- Kiểm tra OAuth redirect URI được thêm trong Google/GitHub settings
- Kiểm tra `.env.local` không có typo

### Admin page hiển thị blank
- Kiểm tra đã đăng nhập thành công
- Kiểm tra `NEXTAUTH_SECRET` được set
- Kiểm tra browser console có lỗi gì
- Thử reload page hoặc xóa cache

### Data không lưu
- Kiểm tra folder `/data` có quyền ghi
- Kiểm tra API response (F12 → Network)
- Kiểm tra server logs (terminal)

### Vercel deployment failed
- Kiểm tra tất cả environment variables đã set
- Kiểm tra `NEXTAUTH_URL` = production domain
- Kiểm tra build logs trong Vercel dashboard
- Thử rebuild: Vercel → Deployments → Redeploy

### Performance chậm
- Dùng `npm run build` để kiểm tra build size
- Tối ưu hóa ảnh trong dự án
- Kiểm tra API response time
- Dùng Chrome DevTools Lighthouse

## 🧠 Cấu Trúc Dữ Liệu JSON

### introduction.json
```json
{
  "fullName": "Nguyễn Văn A",
  "title": "Chuyên Gia Xây Dựng",
  "specializations": ["Quản lý dự án", "BIM"],
  "bio": "Mô tả chi tiết...",
  "email": "contact@example.com",
  "phone": "+84 xxx xxx xxx",
  "location": "TP. Hồ Chí Minh"
}
```

### experience.json
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
      "description": "Mô tả chi tiết công việc..."
    }
  ]
}
```

### projects.json
```json
{
  "projects": [
    {
      "id": 1,
      "title": "Dự Án Xây Dựng",
      "description": "Mô tả...",
      "role": "Quản lý",
      "duration": "2021-2022",
      "budget": "5 tỷ",
      "team": "50 người",
      "outcomes": ["Hoàn thành sớm", "Tiết kiệm chi phí"]
    }
  ]
}
```

## 📚 Tài Liệu Thêm

- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js**: https://next-auth.js.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Shadcn/ui**: https://ui.shadcn.com/
- **Vercel Docs**: https://vercel.com/docs

## 📄 Giấy Phép

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.

## 🙏 Credits

Được xây dựng với:
- [Next.js 15](https://nextjs.org/) - React framework
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Lucide Icons](https://lucide.dev/) - Icons
- [Vercel](https://vercel.com/) - Hosting

---

**Tạo bởi**: v0 AI
**Phiên bản**: 1.0.0
**Cập nhật lần cuối**: 2024
#   w e d - c v  
 