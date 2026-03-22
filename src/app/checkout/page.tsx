'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleOrder() {
    if (!name || !phone || !address) {
      setError('Заполни все поля')
      return
    }

    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()

    const { error } = await supabase
      .from('orders')
      .insert({
        name,
        phone,
        address,
        items: cart,
        total: totalPrice,
        user_id: session?.user?.id ?? null
      })

    if (error) {
      setError('Ошибка при оформлении заказа')
      setLoading(false)
      return
    }

    clearCart()
    router.push('/order-success')
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
          <a href="/catalog" className="bg-black text-white px-8 py-3 rounded-full inline-block">
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
        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Форма */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-6">Данные доставки</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Имя</label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Телефон</label>
                <input
                  type="tel"
                  placeholder="+7 999 999 99 99"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Адрес доставки</label>
                <textarea
                  placeholder="Город, улица, дом, квартира"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleOrder}
                disabled={loading}
                className="bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? 'Оформляем...' : 'Оформить заказ'}
              </button>
            </div>
          </div>

          {/* Список товаров */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-6">Ваш заказ</h2>

            <div className="flex flex-col gap-3 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <p className="font-bold">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Итого:</span>
                <span className="text-2xl font-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}