'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { Product, ProductVariant } from '@/types/product';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

type CartItem = {
  product: Product;
  variant?: ProductVariant; // ✅ Thêm variant
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  selectedItems: string[]; // ✅ lưu key productId-variantId
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  setIsCartOpen: Dispatch<SetStateAction<boolean>>;
  getSelectedTotalPrice: () => number;
  getSelectedTotalQuantity: () => number;
  removeSelectedItemsFromCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const router = useRouter();

  // Tạo key duy nhất cho product + variant
  const makeKey = (productId: number, variantId?: number) =>
    variantId ? `${productId}-${variantId}` : `${productId}`;

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const parsed: CartItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
          setSelectedItems(parsed.map(item => makeKey(item.product.id, item.variant?.id)));
        }
      } catch (error) {
        console.warn('❌ Failed to parse cart from storage', error);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      // đồng bộ selectedItems
      setSelectedItems(prevSelected => {
        const keys = cartItems.map(item => makeKey(item.product.id, item.variant?.id));
        return prevSelected.filter(id => keys.includes(id));
      });
    }
  }, [cartItems, isHydrated]);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    const key = makeKey(product.id, variant?.id);

    setCartItems(prev => {
      const existing = prev.find(
        item =>
          item.product.id === product.id &&
          item.variant?.id === variant?.id
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.variant?.id === variant?.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, variant, quantity }];
    });

    toast.success(
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={variant?.image || product.image}
            alt={variant?.name || product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow flex flex-col">
          <span className="text-sm font-semibold text-gray-800">Đã thêm vào giỏ hàng:</span>
          <span className="text-sm text-gray-600">
            {product.name} {variant ? `- ${variant.name}` : ''}
          </span>
        </div>
        <button
          onClick={() => {
            toast.dismiss();
            router.push('/cart');
          }}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition"
        >
          Xem giỏ hàng
        </button>
      </div>,
      { position: 'top-center', autoClose: 4000 }
    );
  };

  const removeFromCart = (key: string) => {
    setCartItems(prev =>
      prev.filter(item => makeKey(item.product.id, item.variant?.id) !== key)
    );
  };

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) return;
    setCartItems(prev =>
      prev.map(item =>
        makeKey(item.product.id, item.variant?.id) === key
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce(
      (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
      0
    );

  const getSelectedTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const key = makeKey(item.product.id, item.variant?.id);
      if (selectedItems.includes(key)) {
        return total + (item.variant?.price || item.product.price) * item.quantity;
      }
      return total;
    }, 0);

  const getSelectedTotalQuantity = () =>
    cartItems.reduce((total, item) => {
      const key = makeKey(item.product.id, item.variant?.id);
      if (selectedItems.includes(key)) {
        return total + item.quantity;
      }
      return total;
    }, 0);

  const removeSelectedItemsFromCart = () => {
    setCartItems(prev =>
      prev.filter(item => !selectedItems.includes(makeKey(item.product.id, item.variant?.id)))
    );
  };

  if (!isHydrated) return null;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        selectedItems,
        setSelectedItems,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        isCartOpen,
        setIsCartOpen,
        getSelectedTotalPrice,
        getSelectedTotalQuantity,
        removeSelectedItemsFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook tiện dụng
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
