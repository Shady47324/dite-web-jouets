import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/client'
import { useCart } from '../state/CartContext'

export default function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [variantId, setVariantId] = useState(null)
  const { add } = useCart()

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/products/${id}`)
      setProduct(data)
      if (data?.variants?.[0]) setVariantId(data.variants[0].id)
    })()
  }, [id])

  if (!product) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={product.images?.[0] || 'https://via.placeholder.com/600x400?text=Product'} className="w-full rounded" />
      <div>
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <label className="block text-sm mb-2">Variant</label>
        <select className="border p-2 rounded mb-4" value={variantId || ''} onChange={e => setVariantId(Number(e.target.value))}>
          {product.variants.map(v => (
            <option key={v.id} value={v.id}>{v.sku} - ${(v.price/100).toFixed(2)}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => add(variantId, 1)}>Add to cart</button>
      </div>
    </div>
  )
}