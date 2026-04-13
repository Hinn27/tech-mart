'use client';

import { useState } from 'react';
import { CheckoutHeader } from '@/components/ecommerce/checkout/checkout-header';
import { CheckoutStepper } from '@/components/ecommerce/checkout/checkout-stepper';
import { AddressForm } from '@/components/ecommerce/checkout/address-form';
import { ShippingMethod } from '@/components/ecommerce/checkout/shipping-method';
import { PaymentMethod } from '@/components/ecommerce/checkout/payment-method';
import { OrderSummary } from '@/components/ecommerce/checkout/order-summary';

const ACCENT = '#10B981';

export default function ThanhToanGiaDungPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Mẫu giỏ hàng gia dụng
  const cartItems = [
    {
      product: {
        id: 'appliance-1',
        name: 'Dyson V15 Detect Absolute — Máy hút bụi không dây',
        price: 18990000,
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=100&h=100&fit=crop',
      },
      quantity: 1,
      variant: 'V15 Detect — Absolute',
    },
    {
      product: {
        id: 'appliance-4',
        name: 'Xiaomi Smart Air Fryer 6.5L — Nồi chiên không dầu',
        price: 2490000,
        image: 'https://images.unsplash.com/photo-1626509653291-18d9a934b9db?w=100&h=100&fit=crop',
      },
      quantity: 2,
      variant: '6.5L — Trắng',
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground">
                Thanh Toán — Đồ Gia Dụng
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
                href="/gia-dung"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại danh sách Đồ gia dụng
              </a>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={cartItems}
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
