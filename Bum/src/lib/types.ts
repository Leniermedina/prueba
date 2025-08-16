export type Category = 'moviles' | 'accesorios' | 'covers';
export interface Product { id: string; slug: string; name: string; price: number; category: Category; images: string[]; description: string; stock: number; featured?: boolean; createdAt: number; updatedAt: number; }
export interface CartItem { productId: string; name: string; price: number; qty: number; image?: string; }
export interface Cart { userId: string; items: CartItem[]; subtotal: number; }
