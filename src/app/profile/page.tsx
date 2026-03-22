'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type Order = {
  id: string
  name: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
  status: string
  created_at: string
}

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth')
        return
      }

      setEmail(session.user.email ?? null)

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (data) setOrders(data)
      setLoading(false)
    }
    load()
  }, [])

  function getStatusText(status: string) {
    const statuses: Record<string, string> = {
      new: '🆕 Новый',
      processing: '⚙️ В обработке',
      shipping: '🚚 Доставляется',
      delivered: '✅ Доставлен',
      cancelled: '❌ Отменён'
    }
    return statuses[status] || status
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-gray-500 mb-8">{email}</p>

        <h2 className="text-xl font-bold mb-4">История заказов</h2>

        {loading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500 mb-4">У вас пока нет заказов</p>
            <a href="/catalog" className="bg-black text-white px-8 py-3 rounded-full inline-block hover:bg-gray-800 transition">
              Перейти в каталог
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Доставка: {order.address}</p>
                  </div>
                  <span className="text-sm font-semibold">{getStatusText(order.status)}</span>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="font-semibold">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-gray-600">Итого:</span>
                  <span className="font-bold text-lg">{order.total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}