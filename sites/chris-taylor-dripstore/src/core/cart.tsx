import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PRODUCTS, type Product } from '../data/site'

export interface CartLine {
  product: Product
  qty: number
}

interface CartValue {
  lines: CartLine[]
  count: number
  total: number
  open: boolean
  setOpen: (open: boolean) => void
  add: (id: string) => void
  remove: (id: string) => void
}

const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)

  const add = useCallback((id: string) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.product.id === id)
      if (existing) {
        return prev.map((line) => (line.product.id === id ? { ...line, qty: line.qty + 1 } : line))
      }
      const product = PRODUCTS.find((item) => item.id === id)
      return product ? [...prev, { product, qty: 1 }] : prev
    })
    setOpen(true)
  }, [])

  const remove = useCallback((id: string) => {
    setLines((prev) =>
      prev
        .map((line) => (line.product.id === id ? { ...line, qty: line.qty - 1 } : line))
        .filter((line) => line.qty > 0),
    )
  }, [])

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0)
    const total = lines.reduce((sum, line) => sum + line.qty * line.product.price, 0)
    return { lines, count, total, open, setOpen, add, remove }
  }, [lines, open, add, remove])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>')
  return context
}
