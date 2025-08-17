import Header from '@/components/layout/Header';
import './globals.css';
import { CartProvider } from '@/context/Cartcontext';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import CartSidebar from '@/components/cart/CartSlidebar';
import CompareBar from '@/components/compare/CompareBar';
import FloatingContactButtons from '@/components/ui/FloatingContactButtons';
import { getCategories, getCategoriesTree } from '@/lib/api';
import PageWrapper from '@/components/layout/PageWrapper';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MinhHieu - Thiết bị xây dựng & nội thất',
  description: 'Sàn thương mại thiết bị vệ sinh, gạch men và thiết bị nhà bếp',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const categoriesTree = await getCategoriesTree();
  return (
    <html lang="vi">
      <body className={`${inter.className} overflow-x-hidden`}>
        <CartProvider>
          {/* <Header categories={categories} categoriesTree={categoriesTree} />
            {children} */}
          <PageWrapper categories={categories} categoriesTree={categoriesTree}>
            {children}
          </PageWrapper>
          <CartSidebar />
          <CompareBar /> {/* 👉 hiển thị bảng so sánh ở mọi trang */}
          <FloatingContactButtons />
          <ToastContainer
            position="top-center" // Hoặc vị trí bạn muốn
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover 
            progressClassName="custom-toast-progress"
          />
        </CartProvider>
      </body>
    </html>
  );
}
