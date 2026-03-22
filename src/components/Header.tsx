'use client'

import { useCart } from '@/components/CartProvider'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { totalItems } = useCart()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Получаем текущего пользователя
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null)
    })

    // Следим за изменениями авторизации
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-gray-900">🛍️ MyShop</a>
        <nav className="flex gap-6 text-gray-600 items-center">
          <a href="/catalog" className="hover:text-black">Каталог</a>
          <a href="/cart" className="hover:text-black flex items-center gap-1">
            Корзина 🛒
            {totalItems > 0 && (
              <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </a>
          {email ? (
            <div className="flex items-center gap-3">
              <a href="/profile" className="text-sm text-gray-500 hidden md:block hover:text-black">{email}</a>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Выйти
              </button>
            </div>
          ) : (
            <a href="/auth" className="hover:text-black">Войти</a>
          )}
        </nav>
      </div>
    </header>
  )
}