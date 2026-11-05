import { useEffect } from 'react'
import { useCart } from '../core/cart'
import { DROP } from '../data/site'

export function CartDrawer() {
  const { lines, count, total, open, setOpen, remove } = useCart()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  return (
    <>
      <div className={`cart-scrim ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className={`cart ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Shopping bag">
        <div className="cart__head">
          <span className="mono">Your bag / {String(count).padStart(2, '0')}</span>
          <button className="cart__close" onClick={() => setOpen(false)} aria-label="Close bag">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <div className="cart__body">
          {lines.length === 0 ? (
            <div className="cart__empty">
              <p className="cart__empty-title">Nothing hanging.</p>
              <p className="cart__empty-copy">
                Pick something worth the hanger.
              </p>
              <button className="btn btn--line" onClick={() => setOpen(false)}>
                Back to the rack
              </button>
            </div>
          ) : (
            <ul className="cart__list">
              {lines.map((line) => (
                <li key={line.product.id} className="cart__line">
                  <div className="cart__thumb">
                    <img src={line.product.image} alt={line.product.name} loading="lazy" />
                  </div>
                  <div className="cart__info">
                    <span className="mono cart__code">{line.product.code}</span>
                    <span className="cart__name">{line.product.name}</span>
                    <span className="cart__meta">
                      {line.product.colorway} · {line.product.sizes[0]}
                    </span>
                    <div className="cart__controls">
                      <button onClick={() => remove(line.product.id)} aria-label={`Remove one ${line.product.name}`}>
                        −
                      </button>
                      <span>{line.qty}</span>
                    </div>
                  </div>
                  <span className="cart__price">${line.product.price * line.qty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart__foot">
          <div className="cart__total">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          <p className="cart__note">
            Drop {DROP.number} checkout opens {DROP.label}. Bag contents are held for 20 minutes.
          </p>
          <button className="btn btn--acid cart__checkout" disabled={lines.length === 0}>
            Checkout at drop
          </button>
        </div>
      </aside>
    </>
  )
}
