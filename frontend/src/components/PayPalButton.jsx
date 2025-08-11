import { useEffect, useRef } from 'react'
import api from '../api/client'

export default function PayPalButton() {
  const ref = useRef(null)

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
    const scriptId = 'paypal-sdk'
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script')
      s.id = scriptId
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      s.onload = renderButtons
      document.body.appendChild(s)
    } else {
      renderButtons()
    }

    async function renderButtons() {
      // eslint-disable-next-line no-undef
      if (!window.paypal) return
      // eslint-disable-next-line no-undef
      window.paypal.Buttons({
        createOrder: async () => {
          const { data } = await api.post('/api/checkout/paypal/create-order')
          return data.id
        },
        onApprove: async (data) => {
          await api.post('/api/checkout/paypal/capture', { orderId: data.orderID })
          window.location = '/order-confirmation'
        },
      }).render(ref.current)
    }
  }, [])

  return <div ref={ref} />
}