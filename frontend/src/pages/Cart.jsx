import { useCart } from '../state/CartContext'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, update, remove } = useCart()
  const total = items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0)

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      {items.length === 0 ? (
        <p>Cart is empty. <Link className="text-blue-600" to="/">Go shopping</Link></p>
      ) : (
        <div className="grid gap-4">
          {items.map(i => (
            <div key={i.id} className="bg-white rounded shadow p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{i.variant.product.name} - {i.variant.sku}</div>
                <div className="text-sm text-gray-600">${(i.variant.price/100).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="1" value={i.quantity} className="border p-1 w-16" onChange={e => update(i.id, Number(e.target.value))} />
                <button className="text-red-600" onClick={() => remove(i.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right font-semibold">Total: ${(total/100).toFixed(2)}</div>
          <div className="text-right">
            <Link to="/checkout" className="bg-green-600 text-white px-4 py-2 rounded inline-block">Proceed to checkout</Link>
          </div>
        </div>
      )}
    </div>
  )
}