import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const img = product.images?.[0] || 'https://via.placeholder.com/400x300?text=Product'
  return (
    <Link to={`/product/${product.id}`} className="block bg-white rounded shadow hover:shadow-md transition">
      <img src={img} alt={product.name} className="w-full h-48 object-cover rounded-t" />
      <div className="p-3">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.variants?.length || 0} variant(s)</p>
      </div>
    </Link>
  )
}