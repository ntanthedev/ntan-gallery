## ntan gallery

Không gian riêng tư để lưu ảnh, thư và ký ức cho bạn thân. Mọi thứ chạy trên Next.js 14 (App Router) với Supabase Postgres/Storage/Auth. Admin chỉ có một tài khoản (email của bạn) và mỗi friend sở hữu key riêng để xem nội dung.

### Tech stack

- Next.js 14 + React 18 + TypeScript  
- Tailwind CSS 3 + shadcn/ui (New York style)  
- Supabase (Postgres, Storage, Auth, Edge Functions)  
- Zod/React Hook Form (coming soon) cho form validation  
- Jose + bcryptjs cho token và hashing  

### Cấu trúc chính

```
app/                # App Router pages + API routes
components/ui/      # shadcn/ui components
components/gallery/ # Gallery-specific building blocks (todo)
components/admin/   # Admin dashboard widgets (todo)
lib/                # Supabase client, auth helpers, utils
```

### Thiết lập môi trường

1. Sao chép `.env.example` thành `.env.local` và điền giá trị:

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   SUPABASE_JWT_SECRET=
   FRIEND_TOKEN_SECRET=
   ADMIN_ALLOWED_EMAIL=you@example.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   RATE_LIMIT_MAX_ATTEMPTS=5
   RATE_LIMIT_WINDOW_MINUTES=10
   UPLOAD_MAX_SIZE_MB=5
   ```

2. Cài đặt dependencies:

   ```bash
   npm install
   ```

3. Chạy dev server:

   ```bash
   npm run dev
   ```

### Scripts

- `npm run dev` – chạy Next.js ở `localhost:3000`
- `npm run build` – build production
- `npm run start` – chạy production build
- `npm run lint` – Next.js + ESLint flat config

### Testing

- `npm run lint` để đảm bảo format/code style.
- Manual QA đề xuất:
  - Trang `/` hiển thị hero + danh sách features.
  - Điều hướng tới `/admin` phải redirect login nếu chưa auth.
  - Đăng nhập Supabase Auth để truy cập dashboard, CRUD friends, upload drag-drop (cần Supabase thật).
  - Trang `/friend/[slug]` hiển thị form nhập key khi chưa có cookie và render thư sau khi verify.

### Database & Supabase

1. Cài [Supabase CLI](https://supabase.com/docs/guides/cli) và đăng nhập.
2. Chạy migrations + seed:

   ```bash
   supabase db reset --local
   # hoặc:
   supabase db push && supabase db seed
   ```

3. Cập nhật bảng `admin_profile` bằng `user_id` thật sau khi tạo user trong Supabase Auth. Bạn cũng có thể tạo trigger/SQL tùy thích dựa trên file `supabase/migrations/202411170001_init.sql`.

### Auth flow

- `/admin/login` dùng Supabase Auth password grant. Middleware sẽ đảm bảo chỉ email trong `ADMIN_ALLOWED_EMAIL` truy cập được.
- `/admin` và toàn bộ `/admin/*` được bảo vệ cả ở middleware lẫn server component (`requireAdminSession`).
- `lib/supabase/*` tách riêng browser/server/service client để không lộ service key.

### Tiến độ

- [x] Base project + Tailwind 3 + shadcn init
- [x] Landing page mô tả kiến trúc, upload flow, checklist
- [x] Mẫu env cho Supabase / bảo mật
- [ ] Schema Supabase + migrations
- [ ] Luồng verify key & render thư
- [ ] Admin panel CRUD + upload pipeline
- [ ] Testing + deployment checklist

### Định hướng tiếp theo

- Viết migrations cho `friends`, `access_logs`, `rate_limits`, `uploads`
- Cấu hình Supabase Auth (chỉ whitelist admin email)
- Xây API `/api/verify-key` + tokens HttpOnly
- Hoàn thiện admin dashboard với drag & drop + upload realtime
