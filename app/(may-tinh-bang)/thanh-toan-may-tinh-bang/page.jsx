'use client';

import { AddressForm } from '@/components/ecommerce/checkout/address-form';
import { CheckoutHeader } from '@/components/ecommerce/checkout/checkout-header';
import { CheckoutStepper } from '@/components/ecommerce/checkout/checkout-stepper';
import { OrderSummary } from '@/components/ecommerce/checkout/order-summary';
import { PaymentMethod } from '@/components/ecommerce/checkout/payment-method';
import { ShippingMethod } from '@/components/ecommerce/checkout/shipping-method';
import { useState } from 'react';

const ACCENT = '#7C3AED';

export default function ThanhToanMayTinhBangPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Mẫu giỏ hàng máy tính bảng
  const cartItems = [
    {
      product: {
        id: 'tablet-1',
        name: 'iPad Pro M4 13 inch WiFi 256GB — Space Black',
        price: 32990000,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop',
      },
      quantity: 1,
      variant: '256GB — Space Black',
    },
    {
      product: {
        id: 'tablet-2',
        name: 'Samsung Galaxy Tab S9 Ultra 512GB — Graphite',
        price: 27990000,
        image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=100&h=100&fit=crop',
      },
      quantity: 1,
      variant: '512GB — Graphite',
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
                style={{ backgroundColor: ACCENT }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground">
                Thanh Toán — Máy Tính Bảng
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
                href="/may-tinh-bang"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại danh sách máy tính bảng
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
            <a href="#" className="hover:underline" style={{ color: ACCENT }}>
              Chính sách điều khoản
            </a>{' '}
            và{' '}
            <a href="#" className="hover:underline" style={{ color: ACCENT }}>
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
