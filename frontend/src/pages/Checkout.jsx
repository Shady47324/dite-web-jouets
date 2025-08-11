import api from '../api/client'
import PayPalButton from '../components/PayPalButton'

export default function Checkout() {
  const payWithStripe = async () => {
    const { data } = await api.post('/api/checkout/create-session')
    if (data.url) window.location = data.url
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-3">Pay with Card (Stripe)</h2>
        <button onClick={payWithStripe} className="bg-purple-600 text-white px-4 py-2 rounded">Checkout with Stripe</button>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-3">Pay with PayPal</h2>
        <PayPalButton />
      </div>
    </div>
  )
}