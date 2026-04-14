'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import { useSignIn, useSignUp } from '@/lib/auth';

export function AuthModal() {
  const isOpen = useAuthStore((state) => state.isAuthModalOpen);
  const closeAuthModal = useAuthStore((state) => state.closeAuthModal);

  const signIn = useSignIn();
  const signUp = useSignUp();

  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeAuthModal]);

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Vui lòng nhập email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không hợp lệ';
        break;
      case 'password':
        if (!value) return 'Vui lòng nhập mật khẩu';
        if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        break;
      case 'name':
        if (!value) return 'Vui lòng nhập họ tên';
        if (value.length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
        break;
      case 'confirmPassword':
        if (!value) return 'Vui lòng xác nhận mật khẩu';
        if (value !== formData.password) return 'Mật khẩu không khớp';
        break;
    }
    return undefined;
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setServerError('');
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    const fields = mode === 'login'
      ? ['email', 'password']
      : ['name', 'email', 'password', 'confirmPassword'];

    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));

    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password);
      }
      closeAuthModal();
      resetForm();
    } catch (err) {
      setServerError(
        mode === 'login'
          ? 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.'
          : 'Đăng ký thất bại. Email có thể đã được sử dụng.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
    setErrors({});
    setTouched({});
    setServerError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay with glassmorphism */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl animate-in zoom-in-95 fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Chào mừng bạn quay trở lại!'
              : 'Tạo tài khoản để trải nghiệm mua sắm tốt hơn'}
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium" role="alert">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (register only) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Nguyễn Văn A"
                  className={cn(
                    "w-full h-11 pl-10 pr-4 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                    errors.name && touched.name ? 'border-destructive' : 'border-input'
                  )}
                />
              </div>
              {errors.name && touched.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="example@email.com"
                className={cn(
                  "w-full h-11 pl-10 pr-4 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                  errors.email && touched.email ? 'border-destructive' : 'border-input'
                )}
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={cn(
                  "w-full h-11 pl-10 pr-11 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                  errors.password && touched.password ? 'border-destructive' : 'border-input'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password field (register only) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="••••••••"
                  className={cn(
                    "w-full h-11 pl-10 pr-11 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                    errors.confirmPassword && touched.confirmPassword ? 'border-destructive' : 'border-input'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Forgot password (login only) */}
          {mode === 'login' && (
            <div className="text-right">
              <a href="#" className="text-sm text-accent hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold disabled:opacity-50"
          >
            {isLoading
              ? (mode === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...')
              : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Hoặc</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-11">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" className="h-11">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>

        {/* Switch mode */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="text-accent hover:underline font-medium"
          >
            {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
