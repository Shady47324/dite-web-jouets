import { useEffect, useState } from 'react'
import api from '../api/client'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', description: '', images: [], variants: [] })

  const reload = async () => {
    const [p, o] = await Promise.all([
      api.get('/api/products'),
      api.get('/api/admin/orders'),
    ])
    setProducts(p.data)
    setOrders(o.data)
  }

  useEffect(() => { reload() }, [])

  const createProduct = async () => {
    const payload = { ...form, images: [], variants: [{ sku: 'NEW-1', price: 1000, stock: 10 }] }
    await api.post('/api/admin/products', payload)
    setForm({ name: '', description: '', images: [], variants: [] })
    await reload()
  }

  const deleteProduct = async (id) => {
    await api.delete(`/api/admin/products/${id}`)
    await reload()
  }

  const markShipped = async (id) => {
    await api.put(`/api/admin/orders/${id}/status`, { status: 'shipped' })
    await reload()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-semibold mb-2">Products</h2>
        <div className="bg-white rounded shadow p-3 mb-4">
          <input className="border p-2 mr-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="border p-2 mr-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={createProduct}>Create</button>
        </div>
        <ul className="space-y-2">
          {products.map(p => (
            <li key={p.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.variants?.length || 0} variant(s)</div>
              </div>
              <button className="text-red-600" onClick={() => deleteProduct(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Orders</h2>
        <ul className="space-y-2">
          {orders.map(o => (
            <li key={o.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
              <div>
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-500">Status: {o.status} - ${(o.totalAmount/100).toFixed(2)}</div>
              </div>
              {o.status !== 'shipped' && <button className="text-blue-600" onClick={() => markShipped(o.id)}>Mark shipped</button>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}