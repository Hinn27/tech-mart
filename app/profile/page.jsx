'use client';

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
  Check,
  ClipboardCopy,
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
  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-accent" />
          Thông tin tài khoản
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="Email" value={user.email} />
          <InfoField
            label="Họ và tên"
            value={user.user_metadata?.full_name || 'Chưa cập nhật'}
          />
          <InfoField
            label="Ngày tạo tài khoản"
            value={
              user.created_at
                ? new Date(user.created_at).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '—'
            }
          />
          <InfoField
            label="Đăng nhập lần cuối"
            value={
              user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'
            }
          />
        </div>
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
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-accent" />
            Quản lý sản phẩm
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Thêm sản phẩm', 'Sửa sản phẩm', 'Xoá sản phẩm', 'Danh sách SP'].map(
              (label) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-all text-sm font-medium text-foreground"
                >
                  <Package className="h-5 w-5 text-accent" />
                  {label}
                </button>
              )
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * Tính năng CRUD sản phẩm đang được phát triển.
          </p>
        </div>

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
