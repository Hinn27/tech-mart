'use client';

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts';

import { AuthModal } from '@/components/ecommerce/auth-modal';
import { Footer } from '@/components/ecommerce/footer';
import { Header } from '@/components/ecommerce/header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import {
  createVoucher,
  deleteVoucher,
  fetchAllVouchers,
  toggleVoucher,
} from '@/lib/voucherService';
import useAuthStore from '@/store/authStore';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  uploadProductImage,
} from '@/lib/productService';
import {
  Check,
  ClipboardCopy,
  Edit,
  Image as ImageIcon,
  LogOut,
  Package,
  Plus,
  Settings,
  ShieldCheck,
  Tag,
  Ticket,
  Trash2,
  User,
  X,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const ADMIN_EMAIL = 'admin@techmart.vn';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Redirect nếu chưa đăng nhập (sau khi hydrate xong)
  useEffect(() => {
    if (hydrated && !isLoading && !user) {
      router.push('/');
    }
  }, [hydrated, isLoading, user, router]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Đơn hàng', icon: Package },
    ...(isAdmin
      ? [{ id: 'admin', label: 'Quản trị hệ thống', icon: ShieldCheck }]
      : []),
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    useAuthStore.getState().signOut();
    router.push('/');
  };

  // Loading / chưa hydrate
  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[1400px] px-4 py-12">
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
            <div className="h-5 w-48 rounded bg-muted animate-pulse" />
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent to-accent/60 text-accent-foreground flex items-center justify-center text-3xl font-bold shadow-lg shadow-accent/20">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-foreground">
              {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                Quản trị viên
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && <TabInfo user={user} />}
        {activeTab === 'orders' && <TabOrders />}
        {activeTab === 'admin' && isAdmin && <TabAdmin />}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

// ============================================================
// Tab: Thông tin cá nhân
// ============================================================
function TabInfo({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
    dob: user?.user_metadata?.dob || '',
    gender: user?.user_metadata?.gender || 'other',
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: formData,
      });
      if (error) throw error;

      useAuthStore.setState({ user: data.user });
      setIsEditing(false);
      showToast('Cập nhật thông tin thành công!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      {toast && (
        <div
          className={`p-3 rounded-xl text-sm font-medium border-2 animate-in slide-in-from-top fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-success/10 text-success border-success/30'
              : 'bg-destructive/10 text-destructive border-destructive/30'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            Thông tin tài khoản
          </h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Họ và tên</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giới tính</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={loading}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {loading ? 'Đang lưu...' : 'Lưu lại'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="Email" value={user.email} />
            <InfoField label="Họ và tên" value={user.user_metadata?.full_name || '—'} />
            <InfoField label="Số điện thoại" value={user.user_metadata?.phone || '—'} />
            <InfoField label="Ngày sinh" value={user.user_metadata?.dob ? new Date(user.user_metadata.dob).toLocaleDateString('vi-VN') : '—'} />
            <InfoField label="Giới tính" value={user.user_metadata?.gender === 'male' ? 'Nam' : user.user_metadata?.gender === 'female' ? 'Nữ' : user.user_metadata?.gender === 'other' ? 'Khác' : '—'} />
            <InfoField label="Địa chỉ" value={user.user_metadata?.address || '—'} />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

// ============================================================
// Tab: Đơn hàng
// ============================================================
function TabOrders() {
  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">Chưa có đơn hàng</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Các đơn hàng của bạn sẽ hiển thị tại đây sau khi bạn hoàn tất mua sắm.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Tab: Quản trị hệ thống (Admin Only)
// ============================================================
function TabAdmin() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Main Content — 2 cột */}
      <div className="xl:col-span-2 space-y-6">
        {/* CRUD Sản phẩm */}
        <ProductAdmin />

        {/* Quản lý Voucher — Bảng */}
        <VoucherTable />
      </div>

      {/* Sidebar — Voucher (1 cột phải) */}
      <div className="xl:col-span-1">
        <VoucherSidebar />
      </div>
    </div>
  );
}

// ============================================================
// Voucher Table — Bảng danh sách voucher
// ============================================================
function VoucherTable() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVouchers = useCallback(async () => {
    setLoading(true);
    const data = await fetchAllVouchers();
    setVouchers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  const handleToggle = async (id, currentState) => {
    try {
      await toggleVoucher(id, !currentState);
      setVouchers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, is_active: !currentState } : v))
      );
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn chắc chắn muốn xoá voucher này?')) return;
    try {
      await deleteVoucher(id);
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Ticket className="h-5 w-5 text-accent" />
          Danh sách Voucher
        </h2>
        <Button variant="ghost" size="sm" onClick={loadVouchers} className="text-xs">
          Làm mới
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : vouchers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Chưa có voucher nào. Tạo mới ở sidebar bên phải.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">
                  Mã
                </th>
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">
                  Loại
                </th>
                <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">
                  Giá trị
                </th>
                <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground">
                  Trạng thái
                </th>
                <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr
                  key={voucher.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <code className="px-2 py-0.5 rounded bg-muted text-accent font-mono font-bold text-xs">
                      {voucher.code}
                    </code>
                  </td>
                  <td className="py-3 px-3 text-foreground">
                    {voucher.type === 'percentage' ? 'Giảm %' : 'Giảm cố định'}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-foreground">
                    {voucher.type === 'percentage'
                      ? `${voucher.value}%`
                      : `${Number(voucher.value).toLocaleString('vi-VN')}đ`}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleToggle(voucher.id, voucher.is_active)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        voucher.is_active
                          ? 'bg-success/15 text-success hover:bg-success/25'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {voucher.is_active ? (
                        <>
                          <Check className="h-3 w-3" /> Active
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" /> Off
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(voucher.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Xoá voucher"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Voucher Sidebar — Form thêm nhanh + Quick Copy
// ============================================================
function VoucherSidebar() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');

  const loadVouchers = useCallback(async () => {
    setLoading(true);
    const data = await fetchAllVouchers();
    setVouchers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCopy = async (voucherCode, id) => {
    try {
      await navigator.clipboard.writeText(voucherCode);
      setCopiedId(id);
      showToast(`Đã copy mã "${voucherCode}"`, 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Không thể copy mã', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !value) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    setCreating(true);
    try {
      const newVoucher = await createVoucher({ code, type, value: Number(value) });
      setVouchers((prev) => [newVoucher, ...prev]);
      setCode('');
      setValue('');
      showToast('Đã tạo voucher thành công!', 'success');
    } catch (err) {
      showToast(`Lỗi: ${err.message}`, 'error');
    }
    setCreating(false);
  };

  return (
    <div className="sticky top-20 space-y-5">
      {/* Toast inline */}
      {toast && (
        <div
          className={`p-3 rounded-xl text-sm font-medium border-2 animate-in slide-in-from-top fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-success/10 text-success border-success/30'
              : 'bg-destructive/10 text-destructive border-destructive/30'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Form Thêm Voucher */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
          <Plus className="h-4 w-4 text-accent" />
          Thêm Voucher nhanh
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="voucher-code"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Mã voucher
            </label>
            <input
              id="voucher-code"
              type="text"
              placeholder="VD: GIAM20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm font-mono font-bold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="voucher-type"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Loại giảm giá
            </label>
            <select
              id="voucher-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="percentage">Giảm theo %</option>
              <option value="fixed">Giảm số tiền cố định</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="voucher-value"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Giá trị {type === 'percentage' ? '(%)' : '(VNĐ)'}
            </label>
            <input
              id="voucher-value"
              type="number"
              min={1}
              placeholder={type === 'percentage' ? 'VD: 20' : 'VD: 100000'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl"
            disabled={creating}
          >
            {creating ? 'Đang tạo...' : 'Tạo Voucher'}
          </Button>
        </form>
      </div>

      {/* Quick Copy — Danh sách voucher nhỏ */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-accent" />
          Voucher hiện có
        </h3>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : vouchers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có voucher nào
          </p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {vouchers.map((v) => (
              <div
                key={v.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  v.is_active
                    ? 'border-border bg-muted/20 hover:bg-muted/40'
                    : 'border-border/50 bg-muted/5 opacity-50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <code className="text-xs font-mono font-bold text-accent">
                    {v.code}
                  </code>
                  <p className="text-[11px] text-muted-foreground">
                    {v.type === 'percentage'
                      ? `Giảm ${v.value}%`
                      : `Giảm ${Number(v.value).toLocaleString('vi-VN')}đ`}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(v.code, v.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    copiedId === v.id
                      ? 'bg-success/15 text-success'
                      : 'hover:bg-muted text-muted-foreground hover:text-accent'
                  }`}
                  title={`Copy mã ${v.code}`}
                >
                  {copiedId === v.id ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <ClipboardCopy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================
const parseSpecs = (text) => {
  if (!text || !text.trim()) return {};
  const obj = {};
  text.split(',').forEach(part => {
     const [key, ...vals] = part.split(':');
     if (key && vals.length > 0) {
       obj[key.trim()] = vals.join(':').trim();
     }
  });
  return obj;
}

const stringifySpecs = (obj) => {
  if (!obj || typeof obj !== 'object' || Object.keys(obj).length === 0) return '';
  return Object.entries(obj).map(([key, val]) => `${key}: ${val}`).join(', ');
}

// ============================================================
// Product Admin — Bảng quản lý Sản phẩm (CRUD)
// ============================================================
function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    category: 'dien-thoai',
    price: '',
    original_price: '',
    description: '',
    image: '',
    specs: '',
  });
  
  const [fileToUpload, setFileToUpload] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToastMsg = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        title: product.title || product.name || '',
        category: product.categoryOriginal || product.category || 'dien-thoai',
        price: product.price || '',
        original_price: product.originalPrice || product.oldPrice || '',
        description: product.description || '',
        image: product.image || '',
        specs: typeof product.specs === 'object' ? stringifySpecs(product.specs) : (product.specs || ''),
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: 'dien-thoai',
        price: '',
        original_price: '',
        description: '',
        image: '',
        specs: '',
      });
    }
    setFileToUpload(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn chắc chắn muốn xoá sản phẩm này? Vị trí ảnh hưởng không thể khôi phục.')) return;
    try {
      await deleteProduct(id);
      showToastMsg('Đã xoá sản phẩm thành công');
      loadProducts();
    } catch (error) {
      showToastMsg('Lỗi khi xoá sản phẩm', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalImageUrl = formData.image;

      // Xử lý upload nếu có file được chọn từ máy tính
      if (fileToUpload) {
        try {
          const uploadedUrl = await uploadProductImage(fileToUpload);
          if (!uploadedUrl || typeof uploadedUrl !== 'string') {
            throw new Error('Kết quả upload không hợp lệ (không phải URL chuỗi)');
          }
          finalImageUrl = uploadedUrl;
        } catch (uploadError) {
          console.error('[AdminCRUD] Lỗi upload:', uploadError);
          showToastMsg(`Lỗi upload ảnh: ${uploadError.message || 'Vui lòng kiểm tra lại kết nối hoặc dung lượng file'}`, 'error');
          setSubmitting(false);
          return;
        }
      }

      // Đảm bảo finalImageUrl là chuỗi trước khi gửi payload
      if (typeof finalImageUrl !== 'string') {
        finalImageUrl = String(finalImageUrl || '');
      }

      const payload = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category: formData.category,
        price: Number(formData.price),
        old_price: formData.original_price ? Number(formData.original_price) : null,
        description: formData.description,
        image: finalImageUrl,
        specs: parseSpecs(formData.specs),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        showToastMsg('Cập nhật sản phẩm thành công');
      } else {
        await createProduct({ ...payload, rating: 0, review_count: 0 });
        showToastMsg('Thêm sản phẩm thành công');
      }
      setShowModal(false);
      loadProducts();
    } catch (error) {
      console.error('[AdminCRUD] Lỗi lưu SP:', error);
      showToastMsg(`Lỗi lưu sản phẩm: ${error.message || 'Có lỗi hệ thống xảy ra'}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    let matchCat = true;
    if (categoryFilter !== 'all') {
       matchCat = (p.category === categoryFilter || p.categoryOriginal === categoryFilter);
    }
    
    let matchPrice = true;
    const price = Number(p.price) || 0;
    if (priceFilter === 'under-10') matchPrice = price < 10000000;
    else if (priceFilter === '10-20') matchPrice = price >= 10000000 && price <= 20000000;
    else if (priceFilter === 'over-20') matchPrice = price > 20000000;

    return matchCat && matchPrice;
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[500px]">
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[100] p-3 px-5 rounded-xl text-sm font-medium border-2 shadow-xl animate-in slide-in-from-bottom fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-card text-success border-success/30'
              : 'bg-card text-destructive border-destructive/30'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* ======================= */}
      {/* Biểu đồ Thống kê Dashboard */}
      {/* ======================= */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Tổng quan Doanh thu</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ khối - Doanh thu 6 tháng */}
          <div className="p-4 rounded-xl border border-border bg-card/50 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-center">Doanh thu 6 tháng gần nhất</h3>
            {typeof window !== 'undefined' && (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Tháng 10', 'Doanh thu': 1200000000 },
                    { name: 'Tháng 11', 'Doanh thu': 1450000000 },
                    { name: 'Tháng 12', 'Doanh thu': 980000000 },
                    { name: 'Tháng 1', 'Doanh thu': 1800000000 },
                    { name: 'Tháng 2', 'Doanh thu': 1100000000 },
                    { name: 'Tháng 3', 'Doanh thu': 2150000000 },
                  ]}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis 
                      hide
                    />
                    <RechartsTooltip 
                      formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    />
                    <Bar dataKey="Doanh thu" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Biểu đồ tròn - Tỉ lệ danh mục */}
          <div className="p-4 rounded-xl border border-border bg-card/50 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-center">Tỉ lệ bán ra theo danh mục</h3>
            {typeof window !== 'undefined' && (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Điện thoại', value: 45 },
                        { name: 'Laptop', value: 25 },
                        { name: 'Tablet', value: 15 },
                        { name: 'Tivi', value: 10 },
                        { name: 'Gia dụng', value: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => `${value}%`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-accent" />
          Quản lý sản phẩm
        </h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="dien-thoai">Điện thoại</option>
            <option value="laptop">Laptop</option>
            <option value="may-tinh-bang">Tablet</option>
            <option value="tivi">Tivi</option>
            <option value="gia-dung">Gia dụng</option>
          </select>
          
          <select 
            value={priceFilter}
            onChange={e => setPriceFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">Mọi mức giá</option>
            <option value="under-10">Dưới 10 triệu</option>
            <option value="10-20">10tr - 20tr</option>
            <option value="over-20">Trên 20 triệu</option>
          </select>

          <Button size="sm" onClick={() => handleOpenModal()} className="gap-1.5 h-9 bg-accent hover:bg-accent/90 text-accent-foreground font-bold ml-auto sm:ml-2">
            <Plus className="h-4 w-4" /> Thêm SP
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
             <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground w-16">Ảnh</th>
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Sản phẩm</th>
                <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Danh mục</th>
                <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Giá bán</th>
                <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2 px-3">
                    <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground m-auto mt-3" />
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="font-semibold text-foreground line-clamp-1">{p.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{p.slug}</div>
                  </td>
                  <td className="py-2 px-3 text-foreground">{p.categoryOriginal || p.category}</td>
                  <td className="py-2 px-3 text-right font-bold text-destructive">
                    {Number(p.price).toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground">Chưa có sản phẩm nào phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal CRUD */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {editingId ? <Edit className="h-5 w-5 text-accent" /> : <Plus className="h-5 w-5 text-accent" />}
                {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tên sản phẩm *</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Danh mục *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="dien-thoai">Điện thoại</option>
                      <option value="may-tinh-bang">Máy tính bảng</option>
                      <option value="laptop">Laptop & PC</option>
                      <option value="tivi">Tivi</option>
                      <option value="gia-dung">Đồ gia dụng</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giá bán (VNĐ) *</label>
                    <input
                      required
                      type="number"
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giá gốc (nếu có giảm giá)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hình ảnh sản phẩm</label>
                  
                  <div className="flex gap-4 items-start">
                    <div className="h-20 w-20 shrink-0 rounded-lg border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center">
                      {(fileToUpload || formData.image) ? (
                        <img 
                          src={fileToUpload ? URL.createObjectURL(fileToUpload) : formData.image} 
                          alt="preview" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileToUpload(e.target.files[0]);
                          }
                        }}
                        className="text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-accent/10 file:text-accent file:font-semibold hover:file:bg-accent/20 transition-colors w-full"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Hoặc URL ảnh:</span>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={formData.image}
                          onChange={(e) => {
                              setFormData({ ...formData, image: e.target.value });
                              setFileToUpload(null); 
                          }}
                          className="flex-1 h-8 px-2 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thông số kỹ thuật</label>
                  <textarea
                    rows={4}
                    value={formData.specs}
                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Màn hình: 6.1 inch, Chip: Apple A15, RAM: 8GB"
                  />
                  <p className="text-[10px] text-muted-foreground">Nhập dưới dạng văn bản thường: <strong>Tên thông số: Giá trị</strong>, cách nhau bằng dấu phẩy <strong>,</strong></p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mô tả tóm tắt</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/20">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} disabled={submitting}>
                Huỷ
              </Button>
              <Button form="productForm" type="submit" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 font-bold shadow-md">
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang lưu...</>
                ) : 'Lưu sản phẩm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
