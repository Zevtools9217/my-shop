import Header from '@/components/Header'

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">🎉</p>
        <h1 className="text-3xl font-bold mb-4">Заказ оформлен!</h1>
        <p className="text-gray-500 mb-8">Мы свяжемся с вами в ближайшее время</p>
        <a href="/" className="bg-black text-white px-8 py-3 rounded-full inline-block hover:bg-gray-800 transition">
          Вернуться на главную
        </a>
      </div>
    </main>
  )
}