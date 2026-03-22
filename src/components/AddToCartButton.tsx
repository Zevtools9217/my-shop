'use client'
import { CartItem, useCart } from '@/components/CartProvider'


type Props = {
  product: Omit<CartItem, 'quantity'>
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart, cart } = useCart()

  const itemInCart = cart.find(i => i.id === product.id)

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
    >
      {itemInCart ? 'В корзину ✓' : 'В корзину'}
    </button>
  )
}