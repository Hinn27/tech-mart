'use client';

import { useState } from 'react';
import { CheckoutHeader } from '@/components/ecommerce/checkout/checkout-header';
import { CheckoutStepper } from '@/components/ecommerce/checkout/checkout-stepper';
import { AddressForm } from '@/components/ecommerce/checkout/address-form';
import { ShippingMethod } from '@/components/ecommerce/checkout/shipping-method';
import { PaymentMethod } from '@/components/ecommerce/checkout/payment-method';
import { OrderSummary } from '@/components/ecommerce/checkout/order-summary';
import { phoneProducts, tabletProducts } from '@/lib/mock-data';

// Mock giỏ hàng
const mockCartItems = [
  {
    product: phoneProducts[0],
    quantity: 1,
    variant: 'Titan Đen - 256GB',
  },
  {
    product: tabletProducts[0],
    quantity: 1,
    variant: 'Space Black - 256GB',
  },
  {
    product: phoneProducts[2],
    quantity: 2,
    variant: 'Đen - 512GB',
  },
];

export default function CheckoutPage() {
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleShippingChange = (method, price) => {
    setShippingMethod(method);
    setShippingFee(price);
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = () => {
    // TODO: Implement order placement
    alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại TechElite.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimalist Header — Chỉ Logo + Quay lại */}
      <CheckoutHeader />

      {/* Stepper — Thanh tiến trình 3 bước, đang ở Bước 2 */}
      <CheckoutStepper currentStep={2} />

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* ===== Cột Trái (60%) — Form Nhập liệu ===== */}
          <div className="lg:col-span-3 space-y-8">
            {/* Sổ địa chỉ + Form */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <AddressForm />
            </section>

            {/* Phương thức Vận chuyển */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <ShippingMethod
                selectedMethod={shippingMethod}
                onMethodChange={handleShippingChange}
              />
            </section>

            {/* Phương thức Thanh toán */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <PaymentMethod
                selectedMethod={paymentMethod}
                onMethodChange={handlePaymentChange}
              />
            </section>
          </div>

          {/* ===== Cột Phải (40%) — Tóm tắt đơn hàng (Sticky khi cuộn) ===== */}
          <div className="lg:col-span-2">
            <OrderSummary
              items={mockCartItems}
              shippingFee={shippingFee}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
