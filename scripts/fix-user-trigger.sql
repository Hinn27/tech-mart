-- SQL Script: Sửa lỗi "Database error saving new user"
-- Đoạn mã này sẽ tạo/cập nhật Trigger tự động tạo Profile khi có User mới đăng ký (Email, SĐT, Google, Facebook)

-- 1. Tạo hàm xử lý User mới (Robust version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Đảm bảo Trigger này được gắn vào bảng auth.users
-- Lưu ý: Xóa trigger cũ nếu có để tránh trùng lặp
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Đảm bảo bảng profiles cho phép Trigger (chạy dưới quyền superuser/postgres) chèn dữ liệu
-- Trigger SECURITY DEFINER đã xử lý việc này, nhưng ta cần chắc chắn bảng profiles tồn tại
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
