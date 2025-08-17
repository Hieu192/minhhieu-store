'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { Product } from '@/types/product';
import { useEffect } from 'react';
import { toast } from 'react-toastify'; // Sửa đổi: import từ react-toastify
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

type CartItem = Product & { quantity: number };

interface CartContextType {
  cartItems: CartItem[];
  selectedItems: number[];
  // ⭐️ [Quan trọng] Đã sửa kiểu dữ liệu để chấp nhận hàm callback
  setSelectedItems: Dispatch<SetStateAction<number[]>>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const router = useRouter();

  // ⭐️ [Quan trọng] Chỉ dùng một useEffect để tải dữ liệu ban đầu
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
          // Tự động chọn tất cả sản phẩm khi tải giỏ hàng
          setSelectedItems(parsed.map((item: CartItem) => item.id));
        }
      } catch (error) {
        console.warn('❌ Failed to parse cart from storage', error);
      }
    }
    setIsHydrated(true); // Đánh dấu đã tải dữ liệu xong
  }, []); // [] đảm bảo chỉ chạy một lần khi component được mount

  // ⭐️ [Quan trọng] useEffect để lưu dữ liệu và đồng bộ selectedItems
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));

      // Đồng bộ danh sách sản phẩm đã chọn: loại bỏ các sản phẩm không còn trong giỏ hàng
      setSelectedItems(prevSelected => {
        const currentCartIds = cartItems.map(item => item.id);
        return prevSelected.filter(id => currentCartIds.includes(id));
      });
    }
  }, [cartItems, isHydrated, setSelectedItems]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

  // Tạo thông báo mới với giao diện hiện đại
    toast.success(
      <div className="flex items-center gap-4">
        {/* Icon sản phẩm hoặc giỏ hàng */}
        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-grow flex flex-col">
          <span className="text-sm font-semibold text-gray-800">
            Đã thêm vào giỏ hàng:
          </span>
          <span className="text-sm text-gray-600">{product.name}</span>
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
      {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '12px',
        },
      }
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    // selectedItems sẽ được tự động đồng bộ bởi useEffect ở trên
  };

  const updateQuantity = (productId: number, quantity: number) => {
    // ⭐️ [Quan trọng] Logic tối ưu: Nếu số lượng <= 0 thì xóa sản phẩm
    if (quantity <= 0) {
      alert('Số lượng tối thiểu là 1.');
      // removeFromCart(productId);
      return;
    }
    // Nếu số lượng > 0 thì cập nhật
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getSelectedTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.id)) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const getSelectedTotalQuantity = () => {
    return cartItems.reduce((totalQuantity, item) => {
      if (selectedItems.includes(item.id)) {
        return totalQuantity + item.quantity;
      }
      return totalQuantity;
    }, 0);
  };

  const removeSelectedItemsFromCart = () => {
    setCartItems(prev =>
      prev.filter(item => !selectedItems.includes(item.id))
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