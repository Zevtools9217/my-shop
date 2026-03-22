import { supabase } from '@/lib/supabase'
import AddToCartButton from '@/components/AddToCartButton'
import Header from '@/components/Header'
type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  category: string
  stock: number
}

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Product
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
  <Header />

  {/* Главный баннер */}
  ...
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <a href="/catalog" className="text-blue-500 hover:underline">← Вернуться в каталог</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
<Header />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Назад */}
        <a href="/catalog" className="text-gray-500 hover:text-black mb-6 inline-block">
          ← Назад в каталог
        </a>

        <div className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row gap-8">

          {/* Фото */}
          <div className="bg-gray-200 rounded-xl w-full md:w-80 h-80 flex items-center justify-center flex-shrink-0">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-xl" />
            ) : (
              <span className="text-gray-400">Нет фото</span>
            )}
          </div>

          {/* Инфо */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <p className="text-xs text-gray-400 mb-4">В наличии: {product.stock} шт.</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-6">{product.price.toLocaleString('ru-RU')} ₽</p>
              <AddToCartButton product={{
  id: product.id,
  name: product.name,
  price: product.price,
  image_url: product.image_url
}} />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}