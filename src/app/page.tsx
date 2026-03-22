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

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Ошибка загрузки товаров:', error)
    return []
  }

  return data as Product[]
}

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Главный баннер */}
      <section className="bg-black text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Добро пожаловать в YunoShop</h2>
        <p className="text-gray-400 text-lg mb-8">Интернет - магазин</p>
        <a href="/catalog" className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition inline-block">
          Смотреть каталог
        </a>
      </section>

      {/* Товары из базы данных */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold mb-6">
          Популярные товары ({products.length})
        </h3>

        {products.length === 0 ? (
          <p className="text-gray-500">Товары не найдены</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow p-4">
                <a href={`/product/${product.id}`}>
                  <div className="bg-gray-200 h-40 rounded-lg mb-3 flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-gray-400 text-sm">Нет фото</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                  <h4 className="font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-gray-500 text-sm mb-2">{product.description}</p>
                  <p className="font-bold text-lg">{product.price.toLocaleString('ru-RU')} ₽</p>
                  <p className="text-xs text-gray-400 mb-3">В наличии: {product.stock} шт.</p>
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
      </section>

    </main>
  )
}