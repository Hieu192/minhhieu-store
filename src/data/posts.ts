// data/posts.ts (Ví dụ file dữ liệu)
import { Post } from '@/types/post'; // Tạo một type cho Post nếu bạn muốn

export const posts: Post[] = [
    {
    id: 1,
    title: 'Xu hướng thiết kế nội thất 2025',
    slug: 'thiet-ke-noi-that-2025',
    image: '/images/news1.jpg',
    summary:
      'Khám phá những phong cách nội thất đang lên ngôi và phù hợp với không gian sống hiện đại.',
    date: '2025-06-26',
    category: 'Thiết kế',
    content: `Nội dung chi tiết bài viết 1...`
  },
  {
    id: 2,
    title: 'Top 10 thiết bị vệ sinh nên dùng',
    slug: 'top-thiet-bi-ve-sinh',
    image: '/images/news2.jpg',
    summary:
      'Danh sách các thiết bị vệ sinh chất lượng cao được người dùng đánh giá tốt nhất 2025.',
    date: '2025-06-24',
    category: 'Thiết bị',
    content: `Nội dung chi tiết bài viết 2...`
  },
  {
    id: 3,
    title: 'Hướng dẫn chi tiết cách lắp đặt bồn cầu thông minh tại nhà',
    slug: 'lap-dat-bon-cau-thong-minh',
    image: '/images/news/lap-dat-bon-cau.jpg',
    summary: 'Từng bước chi tiết để bạn tự lắp đặt bồn cầu thông minh mà không cần thợ chuyên nghiệp. Đảm bảo đúng kỹ thuật và an toàn.',
    date: '2025-07-29',
    category: 'Hướng dẫn sử dụng & Lắp đặt',
    content: `Nội dung chi tiết bài viết 3...`
  },
  {
    id: 4,
    title: 'Bí quyết vệ sinh và bảo dưỡng sen vòi luôn sáng bóng như mới',
    slug: 've-sinh-sen-voi',
    image: '/images/news/ve-sinh-sen-voi.jpg',
    summary: 'Các mẹo đơn giản giúp bạn giữ cho bộ sen vòi trong phòng tắm luôn sạch sẽ, sáng bóng và bền đẹp theo thời gian.',
    date: '2025-07-28',
    category: 'Hướng dẫn sử dụng & Lắp đặt',
    content: `Nội dung chi tiết bài viết 4...`
  },
  // Mẹo hay & Giải pháp
  {
    id: 5,
    title: '5 mẹo nhỏ biến phòng tắm nhỏ trở nên rộng rãi và tiện nghi hơn',
    slug: 'meo-phong-tam-nho',
    image: '/images/news/phong-tam-nho.jpg',
    summary: 'Khám phá những thủ thuật thiết kế thông minh để tối ưu hóa không gian, giúp phòng tắm nhỏ hẹp trở nên thoáng đãng và tiện dụng.',
    date: '2025-07-27',
    category: 'Mẹo hay & Giải pháp',
    content: `Nội dung chi tiết bài viết 5...`
  },
  {
    id: 6,
    title: 'Cách xử lý bồn cầu bị tắc nghẽn hiệu quả tại nhà chỉ trong 15 phút',
    slug: 'xu-ly-bon-cau-tac',
    image: '/images/news/bon-cau-tac.jpg',
    summary: 'Những phương pháp đơn giản và vật dụng có sẵn giúp bạn giải quyết tình trạng bồn cầu bị tắc nghẽn một cách nhanh chóng.',
    date: '2025-07-25',
    category: 'Mẹo hay & Giải pháp',
    content: `Nội dung chi tiết bài viết 6...`
  },
  // Xu hướng & Cập nhật
  {
    id: 1,
    title: 'Xu hướng thiết kế nội thất 2025',
    slug: 'thiet-ke-noi-that-2025',
    image: '/images/news1.jpg',
    summary: 'Khám phá những phong cách nội thất đang lên ngôi và phù hợp với không gian sống hiện đại.',
    date: '2025-06-26',
    category: 'Xu hướng & Cập nhật',
    content: `Nội dung chi tiết bài viết 1...`
  },
  {
    id: 7,
    title: 'Thiết bị vệ sinh thông minh 2025: Những đột phá công nghệ đáng chú ý',
    slug: 'xu-huong-thiet-bi-thong-minh',
    image: '/images/news/thiet-bi-thong-minh.jpg',
    summary: 'Cập nhật những xu hướng và công nghệ mới nhất trong lĩnh vực thiết bị vệ sinh thông minh, mang lại trải nghiệm tiện nghi tối đa.',
    date: '2025-07-23',
    category: 'Xu hướng & Cập nhật',
    content: `Nội dung chi tiết bài viết 7...`
  },
  {
    id: 8,
    title: 'Phong cách thiết kế phòng tắm tối giản lên ngôi năm 2025',
    slug: 'phong-tam-toi-gian',
    image: '/images/news/phong-tam-toi-gian.jpg',
    summary: 'Tìm hiểu về phong cách thiết kế phòng tắm tối giản, cách ứng dụng để tạo không gian hiện đại, thanh lịch và thư giãn.',
    date: '2025-07-21',
    category: 'Xu hướng & Cập nhật',
    content: `Nội dung chi tiết bài viết 8...`
  },
  // Đánh giá & So sánh
  {
    id: 2,
    title: 'Top 10 thiết bị vệ sinh nên dùng',
    slug: 'top-thiet-bi-ve-sinh',
    image: '/images/news2.jpg',
    summary: 'Danh sách các thiết bị vệ sinh chất lượng cao được người dùng đánh giá tốt nhất 2025.',
    date: '2025-06-24',
    category: 'Đánh giá & So sánh',
    content: `Nội dung chi tiết bài viết 2...`
  },
  {
    id: 9,
    title: 'Đánh giá chi tiết bồn cầu một khối [Tên Thương hiệu/Mã sản phẩm]: Có đáng đầu tư?',
    slug: 'danh-gia-bon-cau-mot-khoi',
    image: '/images/news/danh-gia-bon-cau.jpg',
    summary: 'Bài đánh giá chuyên sâu về ưu nhược điểm, tính năng nổi bật của dòng bồn cầu một khối đang được ưa chuộng trên thị trường.',
    date: '2025-07-19',
    category: 'Đánh giá & So sánh',
    content: `Nội dung chi tiết bài viết 9...`
  },
  {
    id: 10,
    title: 'So sánh vòi rửa bát nóng lạnh và vòi lọc nước: Nên chọn loại nào cho căn bếp?',
    slug: 'so-sanh-voi-rua-bat',
    image: '/images/news/so-sanh-voi.jpg',
    summary: 'Phân tích ưu nhược điểm của hai loại vòi rửa phổ biến, giúp bạn đưa ra lựa chọn phù hợp nhất với nhu cầu sử dụng và ngân sách.',
    date: '2025-07-17',
    category: 'Đánh giá & So sánh',
    content: `Nội dung chi tiết bài viết 10...`
  },
  // Câu hỏi thường gặp (FAQ)
  {
    id: 11,
    title: 'Giải đáp: Nên chọn chất liệu nào cho lavabo để bền đẹp và dễ vệ sinh?',
    slug: 'chon-chat-lieu-lavabo',
    image: '/images/news/chat-lieu-lavabo.jpg',
    summary: 'Tổng hợp các câu hỏi thường gặp về chất liệu lavabo, giúp bạn hiểu rõ ưu nhược điểm của từng loại để chọn được sản phẩm ưng ý.',
    date: '2025-07-15',
    category: 'Câu hỏi thường gặp (FAQ)',
    content: `Nội dung chi tiết bài viết 11...`
  },
  {
    id: 12,
    title: 'Những điều cần biết về chế độ bảo hành và đổi trả thiết bị vệ sinh',
    slug: 'bao-hanh-doi-tra',
    image: '/images/news/bao-hanh-thiet-bi.jpg',
    summary: 'Thông tin chi tiết về chính sách bảo hành, đổi trả sản phẩm thiết bị vệ sinh, giúp bạn an tâm hơn khi mua sắm.',
    date: '2025-07-13',
    category: 'Câu hỏi thường gặp (FAQ)',
    content: `Nội dung chi tiết bài viết 12...`
  },
];