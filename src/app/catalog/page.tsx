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

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data as Product[]
}

export default async function CatalogPage() {
  const products = await getProducts()

  // Получаем уникальные категории из товаров
  const categories = ['Все', ...new Set(products.map(p => p.category))]

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Шапка */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-gray-900">🛍️ MyShop</a>
          <nav className="flex gap-6 text-gray-600">
            <a href="/catalog" className="hover:text-black">Каталог</a>
            <a href="#" className="hover:text-black">Корзина 🛒</a>
            <a href="#" className="hover:text-black">Войти</a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Заголовок */}
        <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>

        {/* Фильтры по категориям */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map((category) => (
            <span
              key={category}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm cursor-pointer hover:bg-black hover:text-white transition"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <a href={`/product/${product.id}`} key={product.id} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition block">
              <div className="bg-gray-200 h-48 rounded-lg mb-3 flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-400 text-sm">Нет фото</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-1">{product.category}</p>
              <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₽</p>
                <p className="text-xs text-gray-400">{product.stock} шт.</p>
              </div>
              <button className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm">
                В корзину
              </button>
            </a>
          ))}
        </div>

      </div>
    </main>
  )
}