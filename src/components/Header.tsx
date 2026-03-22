'use client'

import { useCart } from '@/components/CartProvider'

export default function Header() {
  const { totalItems } = useCart()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-gray-900">🛍️ YunoShop</a>
        <nav className="flex gap-6 text-gray-600">
          <a href="/catalog" className="hover:text-black">Каталог</a>
          <a href="/cart" className="hover:text-black flex items-center gap-1">
            Корзина 🛒
            {totalItems > 0 && (
              <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </a>
          <a href="#" className="hover:text-black">Войти</a>
        </nav>
      </div>
    </header>
  )
}