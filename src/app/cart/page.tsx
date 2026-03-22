'use client'

import { useCart } from '@/components/CartProvider'
import Header from '@/components/Header'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
          <a href="/catalog" className="bg-black text-white px-8 py-3 rounded-full inline-block hover:bg-gray-800 transition">
            Перейти в каталог
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>

        <div className="flex flex-col gap-4 mb-8">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">

              {/* Фото */}
              <div className="bg-gray-200 w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-400 text-xs">Нет фото</span>
                )}
              </div>

              {/* Инфо */}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.price.toLocaleString('ru-RU')} ₽ за шт.</p>
              </div>

              {/* Количество */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Сумма */}
              <p className="font-bold w-24 text-right">
                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
              </p>

              {/* Удалить */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500 transition text-xl"
              >
                ✕
              </button>

            </div>
          ))}
        </div>

        {/* Итог */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Итого:</span>
            <span className="text-2xl font-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          <a href="/checkout" className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition mb-3 block text-center">
  Оформить заказ
</a>
          <button
            onClick={clearCart}
            className="w-full border border-gray-300 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition"
          >
            Очистить корзину
          </button>
        </div>

      </div>
    </main>
  )
}