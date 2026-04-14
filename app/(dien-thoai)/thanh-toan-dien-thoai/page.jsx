'use client';

import { AddressForm } from '@/components/ecommerce/checkout/address-form';
import { CheckoutHeader } from '@/components/ecommerce/checkout/checkout-header';
import { CheckoutStepper } from '@/components/ecommerce/checkout/checkout-stepper';
import { OrderSummary } from '@/components/ecommerce/checkout/order-summary';
import { PaymentMethod } from '@/components/ecommerce/checkout/payment-method';
import { ShippingMethod } from '@/components/ecommerce/checkout/shipping-method';
import { useState } from 'react';

export default function ThanhToanDienThoaiPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Mẫu giỏ hàng điện thoại
  const cartItems = [
    {
      product: {
        id: 'phone-1',
        name: 'iPhone 16 Pro Max 256GB - Titan Đen',
        price: 34990000,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop',
      },
      quantity: 1,
      variant: '256GB - Titan Đen',
    },
    {
      product: {
        id: 'phone-2',
        name: 'Samsung Galaxy S24 Ultra 512GB',
        price: 31990000,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop',
      },
      quantity: 1,
      variant: '512GB - Titan Xám',
    },
  ];

  const handleShippingChange = (method, price) => {
    setShippingMethod(method);
    setShippingFee(price);
  };

  const handlePlaceOrder = () => {
    console.log('Đặt hàng thành công!');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header riêng cho thanh toán */}
      <CheckoutHeader />

      {/* Progress Stepper */}
      <div className="bg-card border-b border-border">
        <CheckoutStepper currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Form thông tin */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tiêu đề trang */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: '#2563EB' }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground">
                Thanh Toán — Điện Thoại
              </h1>
            </div>

            {/* Địa chỉ nhận hàng */}
            <AddressForm />

            {/* Phương thức vận chuyển */}
            <ShippingMethod
              selectedMethod={shippingMethod}
              onMethodChange={handleShippingChange}
            />

            {/* Phương thức thanh toán */}
            <PaymentMethod
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />

            {/* Nút tiếp tục */}
            <div className="flex items-center pt-4 border-t border-border">
              <a
                href="/dien-thoai"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại danh sách điện thoại
              </a>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <OrderSummary

              shippingFee={shippingFee}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>

        {/* Chính sách bảo mật */}
        <div className="mt-12 text-center text-xs text-muted-foreground space-y-1">
          <p>
            Bằng việc đặt hàng, bạn đồng ý với{' '}
            <a href="#" className="hover:underline" style={{ color: '#2563EB' }}>
              Chính sách điều khoản
            </a>{' '}
            và{' '}
            <a href="#" className="hover:underline" style={{ color: '#2563EB' }}>
              Chính sách bảo mật
            </a>{' '}
            của TechElite.
          </p>
          <p className="flex items-center justify-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Thanh toán bảo mật 100% qua SSL
          </p>
        </div>
      </main>
    </div>
  );
}
