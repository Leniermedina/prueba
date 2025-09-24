
// Global cart utilities
export const CART_KEY = 'ebf_cart';

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}
export function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
}
export function addToCart(product, qty=1) {
  const cart = readCart();
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx >= 0) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id: product.id, nombre: product.nombre, precio: product.precio, qty });
  }
  writeCart(cart);
}
export function updateQty(id, qty) {
  let cart = readCart();
  cart = cart.map(i => i.id === id ? { ...i, qty: Math.max(0, qty) } : i).filter(i => i.qty > 0);
  writeCart(cart);
}
export function clearCart() {
  writeCart([]);
}
export function cartTotal(cart=readCart()) {
  return cart.reduce((acc, i) => acc + i.precio * i.qty, 0);
}
