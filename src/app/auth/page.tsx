'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Неверный email или пароль')
      else router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError('Ошибка регистрации — попробуй другой email')
      else setError('На твой email отправлено письмо для подтверждения!')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow p-8">

          <h1 className="text-2xl font-bold mb-2 text-center">
            {isLogin ? 'Войти' : 'Регистрация'}
          </h1>
          <p className="text-gray-500 text-center mb-8">
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            {' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-black font-semibold hover:underline"
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}