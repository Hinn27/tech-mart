'use client';

import { Mail, Phone, MapPin, Facebook, Youtube, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                TE
              </div>
              <span className="font-bold text-xl text-foreground">TechElite</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Hệ thống bán lẻ điện tử uy tín hàng đầu Việt Nam với hơn 500 cửa hàng trên toàn quốc.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Zalo"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Hướng dẫn thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Tra cứu đơn hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Hỏi đáp - FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Trung tâm bảo hành
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Chính sách mua hàng</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground">Hotline mua hàng</p>
                  <a href="tel:1800599999" className="font-semibold text-foreground hover:text-accent transition-colors">
                    1800 599 999 (Miễn phí)
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground">Email hỗ trợ</p>
                  <a href="mailto:support@techelite.vn" className="text-foreground hover:text-accent transition-colors">
                    support@techelite.vn
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground">Văn phòng</p>
                  <span className="text-foreground">
                    Tòa nhà ABC, 123 Nguyễn Huệ, Q.1, TP.HCM
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2024 TechElite. Tất cả các quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://via.placeholder.com/60x30?text=VISA"
                alt="VISA"
                className="h-6 opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://via.placeholder.com/60x30?text=MC"
                alt="Mastercard"
                className="h-6 opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://via.placeholder.com/60x30?text=MoMo"
                alt="MoMo"
                className="h-6 opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://via.placeholder.com/60x30?text=ZaloPay"
                alt="ZaloPay"
                className="h-6 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
