import { useEffect, useState } from 'react'
import api from '../api/client'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/products')
      setProducts(data)
    })()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}