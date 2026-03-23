'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  category: string
  stock: number
}

type Order = {
  id: string
  name: string
  phone: string
  address: string
  total: number
  status: string
  created_at: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuth, setIsAuth] = useState(false)
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  // Форма нового товара
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function handleLogin() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuth(true)
      loadData()
    } else {
      alert('Неверный пароль')
    }
  }

  async function loadData() {
    setLoading(true)
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: o } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (p) setProducts(p)
    if (o) setOrders(o)
    setLoading(false)
  }

  async function handleAddProduct() {
    if (!name || !price || !category || !stock) {
      setMessage('Заполни все обязательные поля')
      return
    }

    setSaving(true)
    setMessage('')

    let image_url = null

    // Загружаем фото если выбрано
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile)

      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(fileName)
        image_url = data.publicUrl
      }
    }

    const { error } = await supabase.from('products').insert({
      name,
      description,
      price: parseInt(price),
      category,
      stock: parseInt(stock),
      image_url
    })

    if (error) {
      setMessage('Ошибка при добавлении товара')
    } else {
      setMessage('✅ Товар добавлен!')
      setName('')
      setDescription('')
      setPrice('')
      setCategory('')
      setStock('')
      setImageFile(null)
      loadData()
    }

    setSaving(false)
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Удалить товар?')) return
    await supabase.from('products').delete().eq('id', id)
    loadData()
  }

  async function handleUpdateStatus(id: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id)
    loadData()
  }

  if (!isAuth) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Админ-панель</h1>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border text-gray-900 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-black"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Войти
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Админ-панель</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setTab('products')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'products' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Товары ({products.length})
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'orders' ? 'bg-black text-gray-90 text-white' : 'hover:bg-пgray-100'}`}
            >
              Заказы ({orders.length})
            </button>
            <a href="/" className="text-sm text-white hover:text-white py-2">
              На сайт →
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Вкладка товаров */}
        {tab === 'products' && (
          <div>
            {/* Форма добавления */}
            <div className="bg-white rounded-2xl shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Добавить товар</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Название *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
                />
                <input
                  placeholder="Категория *"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
                />
                <input
                  placeholder="Цена в рублях *"
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
                />
                <input
                  placeholder="Количество на складе *"
                  type="number"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
                />
                <textarea
                  placeholder="Описание"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black resize-none md:col-span-2"
                />
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Фото товара</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  />
                </div>
              </div>

              {message && (
                <p className={`mt-4 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {message}
                </p>
              )}

              <button
                onClick={handleAddProduct}
                disabled={saving}
                className="mt-4 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving ? 'Сохраняем...' : 'Добавить товар'}
              </button>
            </div>

            {/* Список товаров */}
            <h2 className="text-xl font-bold mb-4">Все товары</h2>
            {loading ? (
              <p className="text-gray-500">Загрузка...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow p-4">
                    <div className="bg-gray-200 h-32 rounded-lg mb-3 overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Нет фото</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{product.category}</p>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.price.toLocaleString('ru-RU')} ₽ · {product.stock} шт.</p>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-full border border-red-300 text-red-500 py-2 rounded-lg text-sm hover:bg-red-50 transition"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Вкладка заказов */}
        {tab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Все заказы</h2>
            {loading ? (
              <p className="text-gray-500">Загрузка...</p>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{order.name}</p>
                        <p className="text-sm text-black-500">{order.phone}</p>
                        <p className="text-sm text-black-500">{order.address}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <p className="font-bold text-lg">{order.total.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <select
                      value={order.status}
                      onChange={e => handleUpdateStatus(order.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-black text-sm"
                    >
                      <option value="new">🆕 Новый</option>
                      <option value="processing">⚙️ В обработке</option>
                      <option value="shipping">🚚 Доставляется</option>
                      <option value="delivered">✅ Доставлен</option>
                      <option value="cancelled">❌ Отменён</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}