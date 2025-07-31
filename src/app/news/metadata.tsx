// app/news/metadata.ts
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin tức & Bài viết về thiết bị vệ sinh | Nội thất phòng tắm',
  description: 'Tổng hợp các bài viết, mẹo hay và tư vấn chọn mua thiết bị vệ sinh, bồn cầu, lavabo, sen vòi hiện đại cho gia đình.',
  openGraph: {
    title: 'Tin tức thiết bị vệ sinh',
    description: 'Chia sẻ kinh nghiệm, mẹo chọn mua và sử dụng bồn cầu, lavabo, sen vòi hiện đại.',
    url: 'https://yourdomain.com/news',
    type: 'website',
    images: ['/images/news1.jpg'],
  },
};
