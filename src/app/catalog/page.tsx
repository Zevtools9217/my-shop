'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import AddToCartButton from '@/components/AddToCartButton'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  category: string
  stock: number
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('Все')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Загружаем товары из базы
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (data) {
        setProducts(data)
        setFiltered(data)
        setCategories(['Все', ...new Set(data.map((p: Product) => p.category))])
      }
      setLoading(false)
    }
    load()
  }, [])

  // Фильтруем при изменении категории или поиска
  useEffect(() => {
    let result = products

    if (activeCategory !== 'Все') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFiltered(result)
  }, [activeCategory, search, products])

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>

        {/* Поиск */}
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-black"
        />

        {/* Фильтры по категориям */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                activeCategory === category
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:bg-black hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Результат */}
        {loading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">Товары не найдены</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
                <a href={`/product/${product.id}`}>
                  <div className="bg-gray-200 h-48 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm">Нет фото</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                  <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₽</p>
                    <p className="text-xs text-gray-400">{product.stock} шт.</p>
                  </div>
                </a>
                <AddToCartButton product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url
                }} />
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}