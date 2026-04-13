'use client';

import { Check, ShoppingCart, Truck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Giỏ hàng', icon: <ShoppingCart className="h-5 w-5" /> },
  { id: 2, name: 'Giao hàng', icon: <Truck className="h-5 w-5" /> },
  { id: 3, name: 'Thanh toán', icon: <CreditCard className="h-5 w-5" /> },
];

export function CheckoutStepper({ currentStep }) {
  return (
    <div className="w-full py-6 px-4">
      <div className="mx-auto max-w-lg">
        <nav aria-label="Tiến trình thanh toán">
          <ol className="flex items-center justify-center">
            {steps.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isUpcoming = step.id > currentStep;

              return (
                <li key={step.id} className="flex items-center">
                  {/* Circle + Label */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300',
                        isCompleted && 'border-success bg-success text-white shadow-md shadow-success/20',
                        isActive && 'border-accent bg-accent text-white shadow-md shadow-accent/20',
                        isUpcoming && 'border-border bg-muted text-muted-foreground'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" strokeWidth={3} />
                      ) : (
                        step.icon
                      )}
                    </div>

                    {/* Tên bước */}
                    <span
                      className={cn(
                        'mt-2.5 text-xs font-semibold',
                        isCompleted && 'text-success',
                        isActive && 'text-accent',
                        isUpcoming && 'text-muted-foreground'
                      )}
                    >
                      {step.name}
                    </span>
                  </div>

                  {/* Đường nối */}
                  {index < steps.length - 1 && (
                    <div className="mx-3 mb-6 flex flex-1 items-center">
                      <div
                        className={cn(
                          'h-0.5 w-full rounded-full transition-all duration-300',
                          step.id < currentStep ? 'bg-success' : 'bg-border'
                        )}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
