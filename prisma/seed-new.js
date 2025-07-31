// seed-news.ts
import { PrismaClient } from '@prisma/client';
// import { createCategorySlug } from './lib/news-helpers'; // Đảm bảo đường dẫn đúng

const prisma = new PrismaClient();

const newsData = [
  // Bài viết 1
  {
    title: 'Top 5 Bồn Cầu Thông Minh Được Ưa Chuộng Nhất Năm 2025',
    slug: 'top-5-bon-cau-thong-minh-uu-chuong-2025',
    image: '/images/news/bon-cau-thong-minh-1.jpg',
    summary: 'Khám phá 5 mẫu bồn cầu thông minh tích hợp công nghệ hiện đại, mang lại trải nghiệm vệ sinh đẳng cấp và tiện nghi tối đa cho gia đình bạn.',
    content: `
      <p>Bồn cầu thông minh đang trở thành xu hướng không thể thiếu trong các không gian phòng tắm hiện đại. Với những tính năng vượt trội như rửa tự động, sấy khô, sưởi ấm nắp ngồi và khử mùi, chúng không chỉ mang lại sự tiện lợi mà còn nâng tầm trải nghiệm vệ sinh.</p>
      <h2>1. Bồn Cầu Toto Neorest NX2</h2>
      <p>Toto Neorest NX2 là một kiệt tác của công nghệ và thiết kế. Với kiểu dáng liền khối sang trọng, sản phẩm này tích hợp đầy đủ các tính năng thông minh như rửa EWATER+, khử mùi tự động, sưởi ấm nắp và công nghệ xả Tornado mạnh mẽ.</p>
      <h2>2. Bồn Cầu Inax Satis G-Type</h2>
      <p>Inax Satis G-Type nổi bật với thiết kế nhỏ gọn, tinh tế và khả năng tiết kiệm không gian. Các tính năng như vòi rửa kép, khử mùi Plasmacluster, và nắp đóng êm ái làm hài lòng mọi người dùng.</p>
      <h2>3. Bồn Cầu Kohler Karing</h2>
      <p>Kohler Karing mang đến sự kết hợp hoàn hảo giữa thẩm mỹ và chức năng. Đặc biệt, hệ thống rửa bọt khí và công nghệ tự động làm sạch vòi phun đảm bảo vệ sinh tối ưu.</p>
      <h2>4. Bồn Cầu American Standard Aerzen</h2>
      <p>American Standard Aerzen được yêu thích bởi sự bền bỉ và hiệu suất cao. Tính năng xả xoáy kép và khả năng tự làm sạch giúp bồn cầu luôn sạch sẽ và giảm thiểu vi khuẩn.</p>
      <h2>5. Bồn Cầu Viglacera V96M</h2>
      <p>Viglacera V96M là lựa chọn lý tưởng cho các gia đình Việt với mức giá phải chăng nhưng vẫn đảm bảo đầy đủ các tính năng cơ bản của một bồn cầu thông minh.</p>
      <h3>Kết luận</h3>
      <p>Việc lựa chọn bồn cầu thông minh phù hợp sẽ phụ thuộc vào ngân sách, nhu cầu và không gian phòng tắm của bạn. Hy vọng với danh sách này, bạn sẽ tìm được sản phẩm ưng ý nhất.</p>
    `,
    date: new Date('2025-07-28T10:00:00Z'),
    category: 'Bồn Cầu Thông Minh',
    isFeatured: true,
  },
  // Bài viết 2
  {
    title: 'Cách Chọn Gạch Lát Nền Cho Phòng Tắm Hiện Đại',
    slug: 'cach-chon-gach-lat-nen-phong-tam-hien-dai',
    image: '/images/news/gach-lat-nen-phong-tam.jpg',
    summary: 'Hướng dẫn chi tiết cách lựa chọn loại gạch lát nền phù hợp để tạo nên không gian phòng tắm sang trọng, bền đẹp và an toàn.',
    content: `
      <p>Gạch lát nền không chỉ quyết định vẻ đẹp thẩm mỹ mà còn ảnh hưởng đến độ bền và an toàn của phòng tắm. Việc lựa chọn gạch phù hợp cần cân nhắc nhiều yếu tố.</p>
      <h2>1. Loại Gạch Phổ Biến</h2>
      <ul>
        <li><strong>Gạch Porcelain:</strong> Có độ bền cao, chống thấm nước tốt, phù hợp cho khu vực ẩm ướt như phòng tắm.</li>
        <li><strong>Gạch Ceramic:</strong> Phổ biến và đa dạng mẫu mã, giá thành phải chăng nhưng độ bền và khả năng chống thấm kém hơn Porcelain.</li>
        <li><strong>Đá Tự Nhiên (Marble, Granite):</strong> Sang trọng, đẳng cấp nhưng cần bảo dưỡng kỹ lưỡng và giá thành cao.</li>
      </ul>
      <h2>2. Kích Thước Gạch</h2>
      <p>Kích thước gạch phụ thuộc vào diện tích phòng tắm. Phòng tắm nhỏ nên chọn gạch kích thước vừa phải (30x30, 40x40) để tạo cảm giác rộng rãi. Phòng tắm lớn có thể dùng gạch khổ lớn (60x60, 80x80) để giảm số lượng đường ron.</p>
      <h2>3. Bề Mặt Gạch</h2>
      <p>Ưu tiên gạch có bề mặt nhám hoặc chống trơn trượt để đảm bảo an toàn, đặc biệt là ở khu vực thường xuyên tiếp xúc với nước.</p>
      <h2>4. Màu Sắc và Họa Tiết</h2>
      <p>Màu sắc và họa tiết gạch nên hài hòa với tổng thể thiết kế phòng tắm. Các gam màu trung tính như trắng, xám, be thường được ưa chuộng vì tạo cảm giác sạch sẽ và hiện đại.</p>
      <h3>Lời khuyên</h3>
      <p>Nên mua gạch từ các thương hiệu uy tín để đảm bảo chất lượng. Tham khảo ý kiến kiến trúc sư nếu bạn còn băn khoăn.</p>
    `,
    date: new Date('2025-07-27T14:30:00Z'),
    category: 'Nội Thất Phòng Tắm',
    isFeatured: false,
  },
  // Bài viết 3
  {
    title: 'Khám Phá Các Xu Hướng Thiết Kế Phòng Tắm Đẹp Năm 2025',
    slug: 'xu-huong-thiet-ke-phong-tam-dep-2025',
    image: '/images/news/thiet-ke-phong-tam.jpg',
    summary: 'Cập nhật những xu hướng thiết kế phòng tắm mới nhất, từ phong cách tối giản đến không gian spa tại gia, mang lại cảm hứng cho ngôi nhà bạn.',
    content: `
      <p>Năm 2025 chứng kiến nhiều sự đổi mới trong thiết kế phòng tắm, tập trung vào sự tiện nghi, bền vững và cá nhân hóa. Dưới đây là những xu hướng nổi bật.</p>
      <h2>1. Phong Cách Tối Giản (Minimalism)</h2>
      <p>Sự đơn giản, tinh tế với các đường nét gọn gàng, màu sắc trung tính và vật liệu tự nhiên vẫn là ưu tiên hàng đầu. Tối giản giúp phòng tắm trở nên thanh lịch và dễ dàng vệ sinh.</p>
      <h2>2. Không Gian Spa Tại Gia</h2>
      <p>Phòng tắm không chỉ là nơi vệ sinh mà còn là nơi thư giãn. Xu hướng này tập trung vào bồn tắm lớn, vòi sen mưa, ánh sáng dịu nhẹ và các vật liệu mang lại cảm giác thư thái.</p>
      <h2>3. Sử Dụng Vật Liệu Tự Nhiên</h2>
      <p>Gỗ, đá, tre, nứa được đưa vào không gian phòng tắm để tạo cảm giác gần gũi với thiên nhiên, mang lại sự ấm áp và độc đáo.</p>
      <h2>4. Công Nghệ Thông Minh</h2>
      <p>Bồn cầu thông minh, gương chống hơi nước, hệ thống chiếu sáng tự động, và các thiết bị điều khiển bằng giọng nói đang dần trở nên phổ biến, nâng cao trải nghiệm người dùng.</p>
      <h2>5. Màu Sắc Đậm và Cảm Hứng Từ Thiên Nhiên</h2>
      <p>Ngoài các gam màu trung tính, những tông màu xanh lá cây đậm, xanh dương sâu hoặc màu đất nung đang được ưa chuộng để tạo điểm nhấn và cá tính cho phòng tắm.</p>
      <h3>Lời khuyên thiết kế</h3>
      <p>Hãy chọn xu hướng phù hợp với phong cách sống và ngân sách của bạn. Đừng ngại thử nghiệm để tạo nên không gian phòng tắm độc đáo và tiện nghi.</p>
    `,
    date: new Date('2025-07-25T09:00:00Z'),
    category: 'Nội Thất Phòng Tắm',
    isFeatured: true,
  },
  // Bài viết 4
  {
    title: 'Phân Biệt Các Loại Vòi Sen Tắm Phổ Biến Hiện Nay',
    slug: 'phan-biet-cac-loai-voi-sen-tam',
    image: '/images/news/voi-sen-tam.jpg',
    summary: 'Tìm hiểu về các loại vòi sen tắm khác nhau như sen cây, sen cầm tay, sen âm tường để lựa chọn sản phẩm phù hợp nhất cho phòng tắm của bạn.',
    content: `
      <p>Vòi sen tắm là một thiết bị không thể thiếu trong phòng tắm, nhưng với sự đa dạng về mẫu mã và chức năng, việc lựa chọn có thể trở nên khó khăn. Dưới đây là các loại vòi sen phổ biến:</p>
      <h2>1. Sen Cây (Sen Đứng)</h2>
      <p>Sen cây có thiết kế sang trọng, hiện đại, thường bao gồm một bát sen lớn cố định trên cao và một bát sen cầm tay. Mang lại trải nghiệm tắm thoải mái như đang đứng dưới mưa.</p>
      <h2>2. Sen Cầm Tay</h2>
      <p>Đây là loại vòi sen truyền thống, linh hoạt và tiện lợi. Bạn có thể dễ dàng điều chỉnh hướng nước, phù hợp cho gia đình có người già và trẻ nhỏ.</p>
      <h2>3. Sen Âm Tường</h2>
      <p>Sen âm tường mang đến vẻ đẹp tối giản, gọn gàng và tinh tế vì toàn bộ đường ống được lắp đặt ẩn trong tường. Phù hợp với các thiết kế phòng tắm hiện đại, cao cấp.</p>
      <h2>4. Sen Tắm Nhiệt Độ</h2>
      <p>Loại sen này cho phép bạn cài đặt và duy trì nhiệt độ nước ổn định, tránh tình trạng nước quá nóng hoặc quá lạnh đột ngột, an toàn hơn cho người sử dụng.</p>
      <h3>Lời khuyên khi chọn mua</h3>
      <p>Hãy cân nhắc không gian phòng tắm, nhu cầu sử dụng và ngân sách để chọn loại vòi sen phù hợp. Nên ưu tiên sản phẩm từ các thương hiệu uy tín.</p>
    `,
    date: new Date('2025-07-23T11:00:00Z'),
    category: 'Thiết Bị Vệ Sinh',
    isFeatured: false,
  },
  // Bài viết 5
  {
    title: 'Gợi Ý Các Mẫu Lavabo Đẹp Cho Phòng Tắm Nhỏ',
    slug: 'mau-lavabo-dep-phong-tam-nho',
    image: '/images/news/lavabo-nho.jpg',
    summary: 'Khám phá những mẫu lavabo nhỏ gọn, thiết kế thông minh giúp tối ưu không gian mà vẫn đảm bảo tính thẩm mỹ cho phòng tắm có diện tích hạn chế.',
    content: `
      <p>Phòng tắm nhỏ là thách thức trong việc lựa chọn thiết bị nhưng với những mẫu lavabo dưới đây, bạn hoàn toàn có thể tạo nên một không gian tiện nghi và đẹp mắt.</p>
      <h2>1. Lavabo Góc</h2>
      <p>Đây là lựa chọn hoàn hảo cho phòng tắm siêu nhỏ vì chúng tận dụng tối đa không gian góc tường, không làm cản trở lối đi.</p>
      <h2>2. Lavabo Treo Tường</h2>
      <p>Thiết kế treo tường giúp giải phóng không gian sàn, tạo cảm giác rộng rãi và thoáng đãng hơn. Dễ dàng vệ sinh khu vực bên dưới.</p>
      <h2>3. Lavabo Bán Âm Bàn</h2>
      <p>Loại lavabo này một phần được đặt âm vào bàn đá, phần còn lại nổi lên trên, giúp tiết kiệm diện tích mặt bàn và tạo điểm nhấn hiện đại.</p>
      <h2>4. Lavabo Mini (Lavabo Tủ Mini)</h2>
      <p>Lavabo tích hợp tủ bên dưới không chỉ cung cấp chức năng rửa tay mà còn có không gian lưu trữ nhỏ gọn, rất tiện lợi cho phòng tắm nhỏ.</p>
      <h3>Lời khuyên lựa chọn</h3>
      <p>Chọn lavabo có chất liệu bền, dễ vệ sinh. Màu sắc sáng giúp phòng tắm trông rộng rãi hơn. Kết hợp với gương lớn để tăng cường hiệu ứng không gian.</p>
    `,
    date: new Date('2025-07-20T08:30:00Z'),
    category: 'Thiết Bị Vệ Sinh',
    isFeatured: false,
  },
  // Bài viết 6
  {
    title: 'Hướng Dẫn Vệ Sinh Bồn Cầu Đúng Cách Đảm Bảo Sạch Sẽ Tối Ưu',
    slug: 'huong-dan-ve-sinh-bon-cau',
    image: '/images/news/ve-sinh-bon-cau.jpg',
    summary: 'Bí quyết vệ sinh bồn cầu hiệu quả, loại bỏ vi khuẩn và mùi hôi khó chịu, giữ cho không gian phòng tắm luôn sạch sẽ, thơm mát.',
    content: `
      <p>Vệ sinh bồn cầu định kỳ là việc làm cần thiết để duy trì vệ sinh và thẩm mỹ cho phòng tắm. Dưới đây là các bước vệ sinh bồn cầu đúng cách.</p>
      <h2>1. Chuẩn Bị Dụng Cụ</h2>
      <p>Bạn cần chuẩn bị: dung dịch tẩy rửa bồn cầu chuyên dụng, bàn chải bồn cầu, găng tay cao su, miếng bọt biển/khăn lau, và nước sạch.</p>
      <h2>2. Xịt Dung Dịch Tẩy Rửa</h2>
      <p>Xịt dung dịch tẩy rửa đều khắp lòng bồn cầu, đặc biệt dưới vành bồn. Để khoảng 5-10 phút để dung dịch phát huy tác dụng.</p>
      <h2>3. Chà Rửa Bồn Cầu</h2>
      <p>Dùng bàn chải bồn cầu chà sạch mọi ngóc ngách bên trong lòng bồn. Dùng miếng bọt biển hoặc khăn ẩm lau sạch bên ngoài bồn, nắp, bệ ngồi và chân bồn.</p>
      <h2>4. Xả Nước và Lau Khô</h2>
      <p>Xả nước để cuốn trôi chất bẩn và dung dịch tẩy rửa. Sau đó, dùng khăn khô sạch lau lại toàn bộ bề mặt bồn cầu để tránh vết ố nước.</p>
      <h3>Lưu ý quan trọng</h3>
      <p>Thực hiện vệ sinh ít nhất 1-2 lần/tuần. Luôn đeo găng tay và đảm bảo phòng tắm thông thoáng khi sử dụng hóa chất.</p>
    `,
    date: new Date('2025-07-18T09:45:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 7
  {
    title: 'Tư Vấn Lựa Chọn Máy Nước Nóng Phù Hợp Cho Gia Đình',
    slug: 'tu-van-chon-may-nuoc-nong',
    image: '/images/news/may-nuoc-nong.jpg',
    summary: 'Tìm hiểu các yếu tố cần cân nhắc khi mua máy nước nóng như dung tích, công suất, loại máy (trực tiếp, gián tiếp) để đưa ra quyết định thông minh.',
    content: `
      <p>Máy nước nóng là thiết bị thiết yếu, đặc biệt trong mùa lạnh. Để chọn được sản phẩm ưng ý, bạn cần xem xét các yếu tố sau:</p>
      <h2>1. Dung Tích</h2>
      <p>Dung tích máy nước nóng phụ thuộc vào số lượng thành viên trong gia đình và nhu cầu sử dụng:</p>
      <ul>
        <li>Dưới 3 người: 15-20 lít</li>
        <li>3-4 người: 30 lít</li>
        <li>Trên 4 người: 40-50 lít hoặc hơn</li>
      </ul>
      <h2>2. Công Suất</h2>
      <p>Công suất càng cao, nước nóng càng nhanh nhưng cũng tiêu thụ điện nhiều hơn. Cân nhắc công suất phù hợp với hệ thống điện nhà bạn.</p>
      <h2>3. Loại Máy Nước Nóng</h2>
      <ul>
        <li><strong>Trực tiếp:</strong> Làm nóng nhanh, nhỏ gọn, phù hợp cho khu vực khí hậu ấm.</li>
        <li><strong>Gián tiếp:</strong> Có bình chứa, giữ nhiệt lâu, phù hợp cho gia đình đông người hoặc khu vực lạnh.</li>
      </ul>
      <h2>4. Tính Năng An Toàn</h2>
      <p>Kiểm tra các tính năng an toàn như chống giật ELCB, chống bỏng, rơ le nhiệt để bảo vệ người sử dụng.</p>
      <h3>Lời khuyên</h3>
      <p>Tham khảo các thương hiệu uy tín như Ariston, Ferroli, Panasonic. So sánh giá và dịch vụ bảo hành trước khi mua.</p>
    `,
    date: new Date('2025-07-15T16:00:00Z'),
    category: 'Thiết Bị Vệ Sinh',
    isFeatured: false,
  },
  // Bài viết 8
  {
    title: 'Kinh Nghiệm Sửa Chữa Bồn Cầu Bị Rò Rỉ Nước Hiệu Quả',
    slug: 'sua-chua-bon-cau-ro-ri-nuoc',
    image: '/images/news/bon-cau-ro-ri.jpg',
    summary: 'Hướng dẫn tự sửa chữa các sự cố rò rỉ nước ở bồn cầu, giúp bạn tiết kiệm chi phí và tránh lãng phí nước không đáng có.',
    content: `
      <p>Bồn cầu bị rò rỉ nước không chỉ gây lãng phí mà còn làm tăng hóa đơn tiền nước. Dưới đây là các bước cơ bản để tự kiểm tra và khắc phục.</p>
      <h2>1. Xác Định Vị Trí Rò Rỉ</h2>
      <p>Kiểm tra kỹ các vị trí như van cấp nước, phao bồn cầu, gioăng cao su, và ống thoát nước.</p>
      <h2>2. Khắc Phục Rò Rỉ Từ Van Cấp Nước</h2>
      <p>Nếu nước rò rỉ từ van cấp nước, hãy dùng cờ lê siết chặt lại. Nếu vẫn rò rỉ, có thể cần thay thế van mới.</p>
      <h2>3. Sửa Chữa Phao Bồn Cầu</h2>
      <p>Nếu phao bị hỏng hoặc đặt sai vị trí, nước sẽ tràn ra ống tràn. Điều chỉnh lại vị trí phao hoặc thay phao mới nếu cần.</p>
      <h2>4. Thay Gioăng Cao Su Chân Bồn Cầu</h2>
      <p>Rò rỉ ở chân bồn cầu thường do gioăng cao su bị lão hóa. Bạn cần tháo bồn cầu ra, làm sạch bề mặt và thay thế gioăng mới.</p>
      <h3>Lưu ý</h3>
      <p>Nếu không tự tin, hãy gọi thợ chuyên nghiệp để đảm bảo an toàn và hiệu quả.</p>
    `,
    date: new Date('2025-07-12T10:00:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 9
  {
    title: 'Những Lợi Ích Của Bồn Tắm Nằm Trong Phòng Tắm Hiện Đại',
    slug: 'loi-ich-bon-tam-nam',
    image: '/images/news/bon-tam-nam.jpg',
    summary: 'Tìm hiểu về những lợi ích tuyệt vời mà bồn tắm nằm mang lại, từ thư giãn cơ thể đến nâng tầm vẻ đẹp sang trọng cho không gian phòng tắm.',
    content: `
      <p>Bồn tắm nằm không chỉ là một thiết bị vệ sinh mà còn là biểu tượng của sự thư giãn và đẳng cấp. Dưới đây là những lợi ích chính.</p>
      <h2>1. Thư Giãn Tuyệt Đối</h2>
      <p>Ngâm mình trong bồn tắm nước ấm giúp giảm căng thẳng, thư giãn cơ bắp, cải thiện giấc ngủ và tinh thần sảng khoái sau một ngày dài.</p>
      <h2>2. Lợi Ích Sức Khỏe</h2>
      <p>Tắm bồn có thể giúp cải thiện tuần hoàn máu, giảm đau nhức xương khớp và hỗ trợ thải độc qua da.</p>
      <h2>3. Nâng Tầm Thẩm Mỹ Phòng Tắm</h2>
      <p>Với đa dạng mẫu mã, kiểu dáng và chất liệu, bồn tắm nằm là điểm nhấn sang trọng, tạo nên không gian phòng tắm đẳng cấp và hiện đại.</p>
      <h2>4. Giá Trị Gia Tăng Cho Ngôi Nhà</h2>
      <p>Một phòng tắm có bồn nằm đẹp mắt có thể làm tăng giá trị tổng thể của ngôi nhà, thu hút hơn nếu bạn có ý định bán hoặc cho thuê.</p>
      <h3>Lời khuyên chọn mua</h3>
      <p>Cân nhắc kích thước phòng tắm, chất liệu (acrylic, composite, gang tráng men) và các tính năng bổ sung như sục khí, sục massage.</p>
    `,
    date: new Date('2025-07-09T14:00:00Z'),
    category: 'Thiết Bị Vệ Sinh',
    isFeatured: true,
  },
  // Bài viết 10
  {
    title: 'Cách Lắp Đặt Bồn Rửa Chén Đơn Giản Tại Nhà',
    slug: 'cach-lap-dat-bon-rua-chen',
    image: '/images/news/lap-dat-bon-rua-chen.jpg',
    summary: 'Hướng dẫn chi tiết các bước lắp đặt bồn rửa chén (chậu rửa bát) một cách an toàn và đúng kỹ thuật ngay tại nhà.',
    content: `
      <p>Lắp đặt bồn rửa chén (chậu rửa bát) không quá phức tạp nếu bạn làm theo các bước hướng dẫn dưới đây.</p>
      <h2>1. Chuẩn Bị Dụng Cụ</h2>
      <p>Bạn cần: bồn rửa chén, vòi rửa, siphon thoát nước, keo silicone, tua vít, cờ lê, kìm, thước đo, bút đánh dấu.</p>
      <h2>2. Khoét Lỗ (Nếu Cần)</h2>
      <p>Nếu mặt bàn chưa có lỗ, hãy đo và khoét lỗ theo kích thước bồn rửa. Đảm bảo các cạnh lỗ mịn và sạch.</p>
      <h2>3. Lắp Đặt Vòi Nước và Siphon</h2>
      <p>Lắp vòi nước vào lỗ trên bồn rửa chén. Sau đó, lắp bộ siphon thoát nước vào lỗ thoát nước của bồn. Đảm bảo các mối nối được siết chặt và không rò rỉ.</p>
      <h2>4. Cố Định Bồn Rửa Chén</h2>
      <p>Đặt bồn rửa vào lỗ khoét trên mặt bàn. Sử dụng các kẹp hoặc vít đi kèm để cố định bồn vào mặt bàn. Bơm keo silicone dọc theo viền bồn để chống thấm nước.</p>
      <h2>5. Kết Nối Ống Nước</h2>
      <p>Kết nối ống cấp nước nóng/lạnh từ tường vào vòi rửa. Kết nối ống thoát nước từ siphon vào hệ thống thoát nước chung.</p>
      <h3>Kiểm tra sau lắp đặt</h3>
      <p>Mở nước kiểm tra kỹ các mối nối xem có bị rò rỉ không. Đảm bảo nước thoát tốt và không có vấn đề gì.</p>
    `,
    date: new Date('2025-07-06T11:30:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 11
  {
    title: 'Lựa Chọn Gương Phòng Tắm Phù Hợp Với Mọi Phong Cách',
    slug: 'lua-chon-guong-phong-tam',
    image: '/images/news/guong-phong-tam.jpg',
    summary: 'Gợi ý các loại gương phòng tắm, từ gương có đèn LED đến gương thông minh, giúp bạn tìm được lựa chọn lý tưởng cho không gian của mình.',
    content: `
      <p>Gương phòng tắm không chỉ là vật dụng tiện ích mà còn là yếu tố quan trọng tạo nên phong cách cho không gian. Dưới đây là các loại gương phổ biến.</p>
      <h2>1. Gương Treo Tường Cổ Điển</h2>
      <p>Loại gương truyền thống, đa dạng về hình dáng (vuông, tròn, oval) và kích thước. Phù hợp với nhiều phong cách thiết kế, dễ dàng lắp đặt.</p>
      <h2>2. Gương Có Đèn LED</h2>
      <p>Gương tích hợp đèn LED mang lại ánh sáng tối ưu cho việc trang điểm, cạo râu và tạo điểm nhấn hiện đại, sang trọng cho phòng tắm.</p>
      <h2>3. Gương Thông Minh</h2>
      <p>Gương thông minh có thể tích hợp nhiều tính năng như màn hình hiển thị nhiệt độ, đồng hồ, loa Bluetooth, chức năng chống hơi nước, biến phòng tắm thành một không gian tiện ích.</p>
      <h2>4. Gương Tủ (Gương Có Tủ Đồ)</h2>
      <p>Kết hợp gương với tủ lưu trữ bên trong, giúp tối ưu không gian cho các vật dụng cá nhân, phù hợp với phòng tắm nhỏ.</p>
      <h3>Lời khuyên</h3>
      <p>Chọn gương có kích thước phù hợp với lavabo và không gian tường. Chất liệu khung gương nên chống ẩm mốc tốt.</p>
    `,
    date: new Date('2025-07-03T10:00:00Z'),
    category: 'Nội Thất Phòng Tắm',
    isFeatured: false,
  },
  // Bài viết 12
  {
    title: 'Tối Ưu Không Gian Phòng Tắm Nhỏ Với Nội Thất Thông Minh',
    slug: 'toi-uu-khong-gian-phong-tam-nho',
    image: '/images/news/phong-tam-nho.jpg',
    summary: 'Các giải pháp nội thất thông minh giúp biến phòng tắm nhỏ trở nên tiện nghi, rộng rãi và đẹp mắt hơn bao giờ hết.',
    content: `
      <p>Thiết kế phòng tắm nhỏ luôn là một thách thức, nhưng với những giải pháp nội thất thông minh, bạn có thể biến không gian này trở nên tiện nghi và ấn tượng.</p>
      <h2>1. Tận Dụng Không Gian Treo Tường</h2>
      <p>Sử dụng các tủ gương âm tường, kệ treo tường, lavabo treo tường để giải phóng không gian sàn, tạo cảm giác rộng rãi và dễ dàng vệ sinh.</p>
      <h2>2. Lựa Chọn Thiết Bị Vệ Sinh Kích Thước Nhỏ</h2>
      <p>Ưu tiên bồn cầu két nước âm tường, lavabo mini, và vòi sen cây có thiết kế gọn gàng để tiết kiệm diện tích.</p>
      <h2>3. Sử Dụng Cửa Trượt Hoặc Cửa Kính</h2>
      <p>Cửa trượt hoặc vách kính cường lực cho khu vực tắm đứng giúp tối ưu không gian và tạo cảm giác xuyên suốt, không bị bí bách.</p>
      <h2>4. Gam Màu Sáng và Gương Lớn</h2>
      <p>Màu sắc sáng (trắng, be, pastel) và gương lớn giúp phản chiếu ánh sáng, tạo hiệu ứng thị giác làm phòng tắm trông rộng và thoáng hơn.</p>
      <h3>Lời khuyên thêm</h3>
      <p>Tận dụng các góc chết bằng kệ góc. Sử dụng phụ kiện đa năng như kệ kết hợp móc treo.</p>
    `,
    date: new Date('2025-06-30T09:00:00Z'),
    category: 'Nội Thất Phòng Tắm',
    isFeatured: false,
  },
  // Bài viết 13
  {
    title: 'Tìm Hiểu Các Loại Nút Nhấn Xả Nước Bồn Cầu Hiện Nay',
    slug: 'cac-loai-nut-nhan-xa-nuoc-bon-cau',
    image: '/images/news/nut-xa-bon-cau.jpg',
    summary: 'Khám phá sự đa dạng của các loại nút nhấn xả nước bồn cầu, từ nút nhấn đơn, nút nhấn kép đến nút nhấn cảm ứng, giúp bạn lựa chọn đúng nhu cầu.',
    content: `
      <p>Nút nhấn xả nước bồn cầu là một bộ phận nhỏ nhưng quan trọng, ảnh hưởng đến hiệu quả sử dụng nước và trải nghiệm người dùng.</p>
      <h2>1. Nút Nhấn Đơn</h2>
      <p>Phổ biến trong các mẫu bồn cầu cũ, chỉ có một nút để xả toàn bộ lượng nước trong két. Không tối ưu về mặt tiết kiệm nước.</p>
      <h2>2. Nút Nhấn Kép (Dual Flush)</h2>
      <p>Gồm hai nút nhấn: một nút nhỏ cho lượng nước xả ít (đại tiện) và một nút lớn cho lượng nước xả nhiều (tiểu tiện). Giúp tiết kiệm nước đáng kể.</p>
      <h2>3. Nút Nhấn Cảm Ứng/Cảm Biến</h2>
      <p>Thường thấy ở các bồn cầu thông minh hoặc khu vực công cộng. Chỉ cần chạm nhẹ hoặc vẫy tay là bồn cầu tự động xả nước, mang lại sự tiện nghi và vệ sinh.</p>
      <h2>4. Nút Nhấn Xả Xoáy</h2>
      <p>Thiết kế nút nhấn kết hợp với công nghệ xả xoáy, tạo dòng nước mạnh mẽ cuốn trôi chất thải, giúp bồn cầu sạch hơn.</p>
      <h3>Lời khuyên</h3>
      <p>Nút nhấn kép là lựa chọn tốt nhất cho các hộ gia đình để tối ưu lượng nước sử dụng.</p>
    `,
    date: new Date('2025-06-28T13:00:00Z'),
    category: 'Thiết Bị Vệ Sinh',
    isFeatured: false,
  },
  // Bài viết 14
  {
    title: 'Bí Quyết Chọn Bồn Cầu 1 Khối Hay 2 Khối Cho Phòng Tắm',
    slug: 'chon-bon-cau-1-khoi-hay-2-khoi',
    image: '/images/news/bon-cau-1-2-khoi.jpg',
    summary: 'Phân tích ưu nhược điểm của bồn cầu 1 khối và 2 khối, giúp bạn đưa ra quyết định phù hợp với không gian và ngân sách của mình.',
    content: `
      <p>Bồn cầu là thiết bị không thể thiếu trong mỗi phòng tắm, và việc lựa chọn giữa bồn cầu 1 khối và 2 khối thường khiến nhiều người băn khoăn.</p>
      <h2>1. Bồn Cầu 1 Khối</h2>
      <p><strong>Ưu điểm:</strong> Thiết kế liền mạch giữa thân và két nước, sang trọng, dễ vệ sinh, ít khe hở tích tụ vi khuẩn. Thường có tính năng xả êm ái hơn.</p>
      <p><strong>Nhược điểm:</strong> Giá thành cao hơn, trọng lượng lớn, khó vận chuyển và lắp đặt. Kích thước thường lớn hơn, không phù hợp cho phòng tắm quá nhỏ.</p>
      <h2>2. Bồn Cầu 2 Khối</h2>
      <p><strong>Ưu điểm:</strong> Két nước và thân bồn tách rời, giá thành phải chăng hơn, dễ vận chuyển và thay thế linh kiện. Phù hợp với nhiều kích thước phòng tắm.</p>
      <p><strong>Nhược điểm:</strong> Có nhiều khe hở giữa két nước và thân bồn, khó vệ sinh hơn, dễ tích tụ bụi bẩn và vi khuẩn. Thiết kế không liền mạch bằng 1 khối.</p>
      <h3>Kết luận</h3>
      <p>Nếu bạn có ngân sách tốt và muốn một không gian sang trọng, dễ vệ sinh, bồn cầu 1 khối là lựa chọn lý tưởng. Nếu ưu tiên tiết kiệm chi phí và dễ thay thế, bồn cầu 2 khối là sự lựa chọn hợp lý.</p>
    `,
    date: new Date('2025-06-25T10:00:00Z'),
    category: 'Thiết Bị Vệ Sinh',
    isFeatured: true,
  },
  // Bài viết 15
  {
    title: 'Thiết Kế Phòng Tắm Chuẩn Phong Thủy Mang Lại May Mắn',
    slug: 'thiet-ke-phong-tam-phong-thuy',
    image: '/images/news/phong-tam-phong-thuy.jpg',
    summary: 'Tìm hiểu các nguyên tắc phong thủy cơ bản khi thiết kế phòng tắm để thu hút năng lượng tích cực và mang lại may mắn cho gia đình.',
    content: `
      <p>Phong thủy phòng tắm đóng vai trò quan trọng trong việc cân bằng năng lượng và ảnh hưởng đến vận khí của ngôi nhà. Dưới đây là những nguyên tắc cơ bản.</p>
      <h2>1. Vị Trí Phòng Tắm</h2>
      <p>Tránh đặt phòng tắm ở trung tâm nhà, đối diện cửa chính, hoặc đối diện phòng ngủ/bếp. Vị trí tốt nhất là ở các cung xấu trong nhà để hóa giải năng lượng tiêu cực.</p>
      <h2>2. Hướng Cửa Phòng Tắm</h2>
      <p>Không nên đặt cửa phòng tắm đối diện cửa chính hoặc cửa phòng ngủ. Nếu không thể thay đổi, có thể dùng rèm hoặc bình phong để hóa giải.</p>
      <h2>3. Ánh Sáng và Thông Gió</h2>
      <p>Phòng tắm cần đủ ánh sáng tự nhiên và thông gió tốt để tránh ẩm ướt, tích tụ khí xấu. Sử dụng quạt thông gió nếu không có cửa sổ.</p>
      <h2>4. Màu Sắc và Vật Liệu</h2>
      <p>Nên chọn các gam màu sáng, trung tính như trắng, be, xám nhạt. Tránh các màu quá tối. Sử dụng vật liệu tự nhiên như gỗ, đá để tạo sự cân bằng.</p>
      <h2>5. Giữ Gìn Sạch Sẽ và Gọn Gàng</h2>
      <p>Điều quan trọng nhất là giữ phòng tắm luôn sạch sẽ, khô ráo và gọn gàng. Hạn chế tích trữ đồ đạc không cần thiết.</p>
      <h3>Lời khuyên</h3>
      <p>Đặt cây xanh nhỏ trong phòng tắm để tăng cường năng lượng mộc, hút ẩm và thanh lọc không khí.</p>
    `,
    date: new Date('2025-06-22T08:00:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 16
  {
    title: 'Chọn Kích Thước Bồn Tắm Phù Hợp Cho Phòng Tắm Gia Đình',
    slug: 'chon-kich-thuoc-bon-tam',
    image: '/images/news/kich-thuoc-bon-tam.jpg',
    summary: 'Hướng dẫn lựa chọn kích thước bồn tắm tối ưu, đảm bảo phù hợp với diện tích phòng tắm và mang lại trải nghiệm sử dụng thoải mái nhất.',
    content: `
      <p>Kích thước bồn tắm là yếu tố then chốt quyết định sự tiện nghi và hài hòa của không gian phòng tắm. Dưới đây là các lưu ý khi chọn kích thước.</p>
      <h2>1. Đo Đạc Chính Xác Diện Tích Phòng Tắm</h2>
      <p>Trước khi mua, hãy đo chiều dài, chiều rộng và chiều cao của khu vực bạn muốn đặt bồn tắm. Trừ đi không gian cần thiết cho lối đi và các thiết bị khác.</p>
      <h2>2. Các Kích Thước Bồn Tắm Phổ Biến</h2>
      <ul>
        <li><strong>Bồn tắm góc:</strong> Thường có kích thước 90x90cm, 95x95cm, 105x105cm, 120x120cm.</li>
        <li><strong>Bồn tắm nằm chữ nhật:</strong> Rất đa dạng, từ 120x70cm, 150x75cm đến 180x80cm hoặc lớn hơn.</li>
        <li><strong>Bồn tắm đứng (đặt độc lập):</strong> Tùy thuộc vào thiết kế, thường có chiều dài từ 150-180cm.</li>
      </ul>
      <h2>3. Cân Nhắc Nhu Cầu Sử Dụng</h2>
      <p>Nếu bạn muốn ngâm mình thoải mái, hãy chọn bồn tắm có chiều dài và chiều sâu đủ lớn. Nếu chỉ dùng để tắm tráng, một bồn nhỏ gọn hơn cũng đủ.</p>
      <h2>4. Xem Xét Vị Trí Cửa và Cửa Sổ</h2>
      <p>Đảm bảo bồn tắm không cản trở việc mở/đóng cửa hay che khuất cửa sổ, ảnh hưởng đến ánh sáng và thông gió.</p>
      <h3>Lời khuyên</h3>
      <p>Thử ngồi vào bồn tắm mẫu tại cửa hàng nếu có thể để cảm nhận sự thoải mái. Tham khảo ý kiến kiến trúc sư để có bố cục tối ưu.</p>
    `,
    date: new Date('2025-06-19T14:00:00Z'),
    category: 'Nội Thất Phòng Tắm',
    isFeatured: false,
  },
  // Bài viết 17
  {
    title: 'Tại Sao Bồn Cầu Inax Luôn Là Lựa Chọn Hàng Đầu?',
    slug: 'tai-sao-bon-cau-inax-luon-la-lua-chon-hang-dau',
    image: '/images/news/bon-cau-inax.jpg',
    summary: 'Tìm hiểu những lý do khiến bồn cầu Inax được tin dùng bởi hàng triệu gia đình Việt, từ chất lượng bền bỉ đến công nghệ tiên tiến.',
    content: `
      <p>Inax là một trong những thương hiệu thiết bị vệ sinh hàng đầu tại Nhật Bản và được ưa chuộng rộng rãi tại Việt Nam. Dưới đây là những lý do khiến bồn cầu Inax luôn là lựa chọn hàng đầu.</p>
      <h2>1. Chất Lượng Bền Bỉ</h2>
      <p>Bồn cầu Inax được sản xuất từ sứ cao cấp, tráng men Aqua Ceramic độc quyền, giúp bề mặt siêu mịn, chống bám bẩn và dễ dàng vệ sinh, giữ bồn cầu luôn sáng bóng.</p>
      <h2>2. Công Nghệ Xả Mạnh Mẽ</h2>
      <p>Inax áp dụng nhiều công nghệ xả tiên tiến như xả xoáy Vortex, xả vành Rimless, giúp cuốn trôi mọi chất thải hiệu quả, tiết kiệm nước.</p>
      <h2>3. Đa Dạng Mẫu Mã</h2>
      <p>Inax cung cấp đa dạng các dòng sản phẩm từ bồn cầu 1 khối, 2 khối đến bồn cầu thông minh, phù hợp với mọi không gian và phong cách thiết kế.</p>
      <h2>4. Tính Năng Thông Minh</h2>
      <p>Các dòng bồn cầu thông minh của Inax tích hợp nhiều tính năng hiện đại như rửa tự động, sấy khô, sưởi ấm nắp ngồi, khử mùi, mang lại trải nghiệm tiện nghi tối đa.</p>
      <h2>5. Giá Cả Hợp Lý</h2>
      <p>Mặc dù là thương hiệu cao cấp, Inax vẫn có nhiều phân khúc giá, đáp ứng được nhu cầu của nhiều đối tượng khách hàng.</p>
      <h3>Kết luận</h3>
      <p>Với sự kết hợp hoàn hảo giữa chất lượng, công nghệ và thiết kế, bồn cầu Inax xứng đáng là lựa chọn hàng đầu cho phòng tắm của bạn.</p>
    `,
    date: new Date('2025-06-16T11:00:00Z'),
    category: 'Thương Hiệu',
    isFeatured: true,
  },
  // Bài viết 18
  {
    title: 'Những Lưu Ý Khi Sửa Chữa Vòi Nước Bị Rò Rỉ',
    slug: 'luu-y-sua-chua-voi-nuoc-ro-ri',
    image: '/images/news/voi-nuoc-ro-ri.jpg',
    summary: 'Hướng dẫn các bước cơ bản để tự sửa chữa vòi nước bị rò rỉ, giúp tiết kiệm nước và tránh hư hại cho thiết bị.',
    content: `
      <p>Vòi nước bị rò rỉ là vấn đề thường gặp trong gia đình, gây lãng phí nước và có thể dẫn đến hư hại các thiết bị khác. Dưới đây là những lưu ý khi tự sửa chữa.</p>
      <h2>1. Khóa Van Tổng Nước</h2>
      <p>Trước khi bắt đầu bất kỳ thao tác sửa chữa nào, hãy đảm bảo bạn đã khóa van tổng cấp nước cho khu vực đó để tránh nước tràn ra ngoài.</p>
      <h2>2. Chuẩn Bị Dụng Cụ</h2>
      <p>Bạn cần: cờ lê, tua vít, kìm, băng tan (cao su non), và gioăng cao su hoặc vòng đệm thay thế.</p>
      <h2>3. Xác Định Nguyên Nhân</h2>
      <p>Phần lớn rò rỉ vòi nước là do gioăng cao su hoặc vòng đệm bị mòn, hư hỏng. Cũng có thể do ốc vít lỏng hoặc thân vòi bị nứt.</p>
      <h2>4. Thay Thế Gioăng/Vòng Đệm</h2>
      <p>Tháo các bộ phận của vòi nước một cách cẩn thận. Thay thế gioăng cao su hoặc vòng đệm mới có kích thước phù hợp. Lắp lại các bộ phận và siết chặt.</p>
      <h2>5. Kiểm Tra Lại</h2>
      <p>Mở van nước từ từ và kiểm tra xem còn rò rỉ không. Nếu vẫn còn, hãy kiểm tra lại các mối nối hoặc cân nhắc gọi thợ chuyên nghiệp.</p>
      <h3>Lời khuyên</h3>
      <p>Luôn chuẩn bị sẵn một bộ dụng cụ sửa chữa cơ bản trong nhà. Thay thế các linh kiện chính hãng để đảm bảo độ bền.</p>
    `,
    date: new Date('2025-06-13T09:30:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 19
  {
    title: 'Bảo Dưỡng Thiết Bị Vệ Sinh Đúng Cách Để Tăng Tuổi Thọ',
    slug: 'bao-duong-thiet-bi-ve-sinh',
    image: '/images/news/bao-duong-thiet-bi.jpg',
    summary: 'Hướng dẫn các phương pháp bảo dưỡng định kỳ cho bồn cầu, lavabo, vòi sen và bồn tắm, giúp thiết bị luôn bền đẹp và hoạt động tốt.',
    content: `
      <p>Bảo dưỡng định kỳ là yếu tố quan trọng giúp các thiết bị vệ sinh trong phòng tắm duy trì độ bền và hiệu suất hoạt động. Dưới đây là các mẹo bảo dưỡng cho từng loại thiết bị.</p>
      <h2>1. Bồn Cầu</h2>
      <p>Vệ sinh lòng bồn và bên ngoài thường xuyên bằng dung dịch tẩy rửa nhẹ. Kiểm tra định kỳ phao, van xả nước để đảm bảo không rò rỉ. Tránh đổ chất thải rắn hoặc hóa chất mạnh vào bồn cầu.</p>
      <h2>2. Lavabo và Vòi Rửa</h2>
      <p>Lau chùi bề mặt lavabo và vòi rửa bằng khăn mềm và dung dịch tẩy rửa trung tính. Vệ sinh lưới lọc ở đầu vòi để tránh tắc nghẽn. Tránh dùng vật sắc nhọn hoặc hóa chất ăn mòn.</p>
      <h2>3. Vòi Sen Tắm</h2>
      <p>Thường xuyên lau chùi bát sen và vòi sen để loại bỏ cặn vôi. Ngâm bát sen vào dung dịch giấm pha loãng nếu bị tắc nghẽn lỗ phun nước.</p>
      <h2>4. Bồn Tắm</h2>
      <p>Lau sạch bồn tắm sau mỗi lần sử dụng để tránh cặn xà phòng và vết ố. Đối với bồn tắm có chức năng sục, nên vệ sinh hệ thống ống dẫn định kỳ.</p>
      <h3>Lời khuyên chung</h3>
      <p>Sử dụng các sản phẩm vệ sinh chuyên dụng và không chứa axit mạnh. Kiểm tra các mối nối, đường ống định kỳ để phát hiện sớm hư hỏng.</p>
    `,
    date: new Date('2025-06-10T15:00:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 20
  {
    title: 'Thiết Kế Phòng Tắm Với Ánh Sáng Tự Nhiên Tối Đa',
    slug: 'thiet-ke-phong-tam-anh-sang-tu-nhien',
    image: '/images/news/anh-sang-phong-tam.jpg',
    summary: 'Khám phá cách tối ưu hóa ánh sáng tự nhiên trong phòng tắm, mang lại không gian sáng sủa, thoáng đãng và tiết kiệm năng lượng.',
    content: `
      <p>Ánh sáng tự nhiên không chỉ giúp tiết kiệm điện mà còn tạo ra một không gian phòng tắm tươi mới, tràn đầy năng lượng. Dưới đây là các cách để tối ưu ánh sáng tự nhiên.</p>
      <h2>1. Cửa Sổ Lớn Hoặc Giếng Trời</h2>
      <p>Nếu có thể, lắp đặt cửa sổ lớn hoặc thiết kế giếng trời để ánh sáng trực tiếp tràn vào. Đảm bảo có rèm hoặc kính mờ để đảm bảo sự riêng tư.</p>
      <h2>2. Sử Dụng Vách Kính Cường Lực</h2>
      <p>Thay vì tường gạch, sử dụng vách kính cường lực cho khu vực tắm đứng giúp ánh sáng phân bổ đều khắp phòng tắm, tạo cảm giác rộng hơn.</p>
      <h2>3. Gam Màu Sáng và Bề Mặt Phản Chiếu</h2>
      <p>Sơn tường và lát gạch bằng các gam màu sáng như trắng, be, kem. Sử dụng gạch men bóng, gương lớn và các bề mặt có khả năng phản chiếu ánh sáng để tăng cường độ sáng.</p>
      <h2>4. Bố Trí Hợp Lý</h2>
      <p>Không đặt các vật cản lớn che chắn cửa sổ. Đảm bảo không gian thông thoáng để ánh sáng dễ dàng lan tỏa.</p>
      <h3>Lưu ý</h3>
      <p>Cần xem xét hướng nắng để tránh ánh sáng quá gắt vào những thời điểm nhất định trong ngày. Kết hợp với ánh sáng nhân tạo bổ sung.</p>
    `,
    date: new Date('2025-06-07T10:00:00Z'),
    category: 'Nội Thất Phòng Tắm',
    isFeatured: false,
  },
  // Bài viết 21
  {
    title: 'Bí Kíp Xử Lý Ố Vàng Bồn Cầu Hiệu Quả Tại Nhà',
    slug: 'xu-ly-o-vang-bon-cau',
    image: '/images/news/o-vang-bon-cau.jpg',
    summary: 'Tổng hợp các mẹo và sản phẩm giúp loại bỏ vết ố vàng cứng đầu trên bồn cầu, trả lại vẻ trắng sáng như mới.',
    content: `
      <p>Ố vàng bồn cầu là vấn đề phổ biến, gây mất thẩm mỹ và khó chịu. Dưới đây là những bí quyết giúp bạn xử lý hiệu quả.</p>
      <h2>1. Sử Dụng Giấm Trắng và Baking Soda</h2>
      <p>Rắc baking soda lên vết ố, sau đó xịt giấm trắng lên. Để hỗn hợp phản ứng trong 30 phút đến vài giờ, sau đó chà sạch bằng bàn chải.</p>
      <h2>2. Chanh Tươi và Muối</h2>
      <p>Cắt đôi quả chanh, rắc muối lên mặt chanh và chà trực tiếp lên vết ố. Axit trong chanh và tính mài mòn của muối sẽ giúp loại bỏ vết bẩn.</p>
      <h2>3. Nước Coca Cola</h2>
      <p>Đổ một lon Coca Cola vào lòng bồn cầu, để qua đêm. Axit phosphoric trong Coca sẽ giúp phân hủy vết ố. Xả sạch vào sáng hôm sau.</p>
      <h2>4. Dung Dịch Tẩy Rửa Chuyên Dụng</h2>
      <p>Đối với các vết ố cứng đầu, nên sử dụng các sản phẩm tẩy rửa bồn cầu chuyên dụng có chứa thành phần tẩy mạnh hơn.</p>
      <h3>Phòng ngừa</h3>
      <p>Vệ sinh bồn cầu định kỳ 1-2 lần/tuần. Hạn chế sử dụng nước có nhiều phèn hoặc cặn vôi. Đảm bảo hệ thống xả nước hoạt động tốt.</p>
    `,
    date: new Date('2025-06-04T09:00:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 22
  {
    title: 'Top 5 Thương Hiệu Thiết Bị Vệ Sinh Cao Cấp Nên Đầu Tư',
    slug: 'top-5-thuong-hieu-thiet-bi-ve-sinh-cao-cap',
    image: '/images/news/thuong-hieu-cao-cap.jpg',
    summary: 'Danh sách 5 thương hiệu thiết bị vệ sinh đẳng cấp, mang đến chất lượng vượt trội, thiết kế sang trọng và công nghệ tiên tiến.',
    content: `
      <p>Đầu tư vào thiết bị vệ sinh cao cấp không chỉ nâng tầm không gian sống mà còn đảm bảo độ bền và trải nghiệm sử dụng tốt nhất. Dưới đây là 5 thương hiệu hàng đầu.</p>
      <h2>1. Toto (Nhật Bản)</h2>
      <p>Nổi tiếng với bồn cầu thông minh Neorest, Toto là biểu tượng của công nghệ tiên tiến, chất lượng vượt trội và thiết kế tinh tế.</p>
      <h2>2. Kohler (Mỹ)</h2>
      <p>Kohler mang đến sự sang trọng và đẳng cấp với các sản phẩm từ bồn tắm, vòi sen đến lavabo, được chế tác tỉ mỉ và tích hợp công nghệ độc đáo.</p>
      <h2>3. Grohe (Đức)</h2>
      <p>Grohe là lựa chọn hàng đầu cho các sản phẩm vòi sen, sen cây, và phụ kiện phòng tắm với thiết kế hiện đại, độ bền cao và công nghệ tiết kiệm nước.</p>
      <h2>4. American Standard (Mỹ)</h2>
      <p>Với lịch sử lâu đời, American Standard cung cấp các giải pháp phòng tắm toàn diện, từ bồn cầu, lavabo đến bồn tắm, chú trọng vào sự thoải mái và vệ sinh.</p>
      <h2>5. Hansgrohe (Đức)</h2>
      <p>Hansgrohe chuyên về các sản phẩm vòi sen và phụ kiện cao cấp, nổi bật với công nghệ AirPower tạo dòng nước mềm mại và công nghệ Select đơn giản hóa điều khiển.</p>
      <h3>Lời khuyên</h3>
      <p>Khi lựa chọn thương hiệu cao cấp, hãy tìm hiểu kỹ về chính sách bảo hành, dịch vụ hậu mãi và uy tín của nhà phân phối.</p>
    `,
    date: new Date('2025-06-01T14:00:00Z'),
    category: 'Thương Hiệu',
    isFeatured: true,
  },
  // Bài viết 23
  {
    title: 'Giải Pháp Chống Thấm Cho Phòng Tắm Hiệu Quả',
    slug: 'giai-phap-chong-tham-phong-tam',
    image: '/images/news/chong-tham-phong-tam.jpg',
    summary: 'Tìm hiểu các phương pháp và vật liệu chống thấm phòng tắm tối ưu, bảo vệ ngôi nhà khỏi ẩm mốc và hư hại do nước.',
    content: `
      <p>Chống thấm là công đoạn cực kỳ quan trọng trong xây dựng và cải tạo phòng tắm để tránh các vấn đề ẩm mốc, hư hại kết cấu. Dưới đây là các giải pháp hiệu quả.</p>
      <h2>1. Vật Liệu Chống Thấm Chuyên Dụng</h2>
      <p>Sử dụng các loại vật liệu chống thấm gốc xi măng polymer, gốc polyurethane hoặc màng chống thấm bitum. Lựa chọn sản phẩm phù hợp với từng bề mặt và điều kiện.</p>
      <h2>2. Quy Trình Thi Công Đúng Kỹ Thuật</h2>
      <p>Đảm bảo bề mặt sàn và tường được làm sạch, bằng phẳng trước khi thi công. Thi công nhiều lớp theo hướng dẫn của nhà sản xuất. Đặc biệt chú ý các góc, đường ống xuyên sàn.</p>
      <h2>3. Kiểm Tra Thử Nước</h2>
      <p>Sau khi hoàn thành lớp chống thấm, cần tiến hành ngâm thử nước (test nước) trong 24-48 giờ để đảm bảo không có rò rỉ trước khi lát gạch.</p>
      <h2>4. Lựa Chọn Gạch và Keo Chít Mạch Chống Thấm</h2>
      <p>Sử dụng gạch có độ hút nước thấp (gạch Porcelain) và keo chít mạch chống thấm để tăng cường khả năng chống thấm cho toàn bộ bề mặt.</p>
      <h3>Lời khuyên</h3>
      <p>Nếu không có kinh nghiệm, nên thuê đơn vị thi công chuyên nghiệp để đảm bảo chất lượng công trình.</p>
    `,
    date: new Date('2025-05-29T10:00:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 24
  {
    title: 'Thiết Kế Phòng Tắm Không Gian Mở Với Cây Xanh',
    slug: 'thiet-ke-phong-tam-khong-gian-mo-cay-xanh',
    image: '/images/news/phong-tam-cay-xanh.jpg',
    summary: 'Khám phá ý tưởng thiết kế phòng tắm với không gian mở và cây xanh, mang thiên nhiên vào nhà, tạo cảm giác thư thái và trong lành.',
    content: `
      <p>Phòng tắm không gian mở kết hợp cây xanh là xu hướng thiết kế đang rất được ưa chuộng, mang lại sự kết nối với thiên nhiên và cảm giác thư thái.</p>
      <h2>1. Vị Trí Thiết Kế</h2>
      <p>Phù hợp với các phòng tắm có cửa sổ lớn, ban công hoặc sân vườn nhỏ liền kề. Tạo ra sự liên kết liền mạch giữa không gian trong nhà và ngoài trời.</p>
      <h2>2. Lựa Chọn Cây Xanh</h2>
      <p>Chọn các loại cây ưa ẩm, chịu bóng râm tốt như trầu bà, dương xỉ, lan ý, cây thường xuân. Đặt cây ở vị trí có đủ ánh sáng và không cản trở lối đi.</p>
      <h2>3. Chất Liệu Tự Nhiên</h2>
      <p>Sử dụng vật liệu tự nhiên như gỗ, đá, sỏi, tre để tăng cường yếu tố thiên nhiên. Sàn gỗ chống thấm hoặc gạch giả gỗ là lựa chọn tuyệt vời.</p>
      <h2>4. Ánh Sáng Tự Nhiên</h2>
      <p>Tối đa hóa ánh sáng tự nhiên thông qua cửa kính lớn, giếng trời để cây xanh phát triển tốt và không gian luôn sáng sủa.</p>
      <h2>5. Hệ Thống Thông Gió</h2>
      <p>Đảm bảo phòng tắm có hệ thống thông gió tốt để kiểm soát độ ẩm, tránh nấm mốc phát triển do có cây xanh.</p>
      <h3>Lợi ích</h3>
      <p>Mang lại không khí trong lành, cải thiện chất lượng không khí, giảm căng thẳng và tăng tính thẩm mỹ cho phòng tắm.</p>
    `,
    date: new Date('2025-05-26T16:00:00Z'),
    category: 'Nội Thất Phòng Tắm',
    isFeatured: false,
  },
  // Bài viết 25
  {
    title: 'Các Bước Vệ Sinh Vòi Sen Tắm Bị Tắc Nghẽn Đơn Giản',
    slug: 've-sinh-voi-sen-tam-tac-nghen',
    image: '/images/news/voi-sen-tac-nghen.jpg',
    summary: 'Hướng dẫn chi tiết cách làm sạch vòi sen tắm bị tắc nghẽn do cặn vôi và khoáng chất, giúp nước chảy mạnh và đều trở lại.',
    content: `
      <p>Vòi sen tắm bị tắc nghẽn do cặn vôi và khoáng chất là vấn đề phổ biến, làm giảm áp lực nước và ảnh hưởng đến trải nghiệm tắm. Dưới đây là cách khắc phục.</p>
      <h2>1. Tháo Rời Bát Sen</h2>
      <p>Nếu có thể, hãy tháo rời bát sen khỏi ống dẫn. Điều này giúp việc vệ sinh dễ dàng hơn.</p>
      <h2>2. Ngâm Bát Sen Trong Giấm Trắng</h2>
      <p>Pha loãng giấm trắng với nước theo tỉ lệ 1:1. Ngâm bát sen vào dung dịch này trong vài giờ hoặc qua đêm. Axit acetic trong giấm sẽ hòa tan cặn vôi.</p>
      <h2>3. Dùng Bàn Chải Hoặc Tăm</h2>
      <p>Sau khi ngâm, dùng bàn chải nhỏ hoặc tăm để cọ rửa và làm sạch từng lỗ phun nước. Bạn cũng có thể dùng kim nhỏ để thông các lỗ bị tắc nghẽn nặng.</p>
      <h2>4. Rửa Sạch Lại Với Nước</h2>
      <p>Rửa sạch bát sen dưới vòi nước chảy mạnh để loại bỏ hoàn toàn cặn bẩn và giấm. Lắp lại bát sen vào vị trí.</p>
      <h3>Mẹo nhanh (không cần tháo rời)</h3>
      <p>Đổ giấm vào túi nilon, buộc túi quanh bát sen sao cho bát sen ngập trong giấm. Để vài giờ hoặc qua đêm, sau đó tháo túi và xả nước.</p>
    `,
    date: new Date('2025-05-23T11:00:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 26
  {
    title: 'Xu Hướng Sử Dụng Vòi Chậu Lavabo Cảm Ứng Thông Minh',
    slug: 'voi-chau-lavabo-cam-ung',
    image: '/images/news/voi-lavabo-cam-ung.jpg',
    summary: 'Tìm hiểu về vòi chậu lavabo cảm ứng, những lợi ích mang lại từ vệ sinh, tiết kiệm nước đến nâng tầm không gian hiện đại.',
    content: `
      <p>Vòi chậu lavabo cảm ứng đang dần trở thành lựa chọn ưu tiên cho các phòng tắm và bếp hiện đại nhờ những ưu điểm vượt trội.</p>
      <h2>1. Tiết Kiệm Nước Hiệu Quả</h2>
      <p>Nước chỉ chảy khi có vật thể (tay) ở dưới vòi và tự động ngắt khi không sử dụng, giúp giảm đáng kể lượng nước lãng phí.</p>
      <h2>2. Vệ Sinh và An Toàn</h2>
      <p>Không cần chạm vào vòi, hạn chế sự lây lan của vi khuẩn. Đặc biệt hữu ích ở nơi công cộng hoặc trong gia đình có trẻ nhỏ, người già.</p>
      <h2>3. Tiện Lợi và Sang Trọng</h2>
      <p>Mang lại trải nghiệm sử dụng tiện lợi và hiện đại. Thiết kế thường tinh gọn, góp phần nâng tầm vẻ đẹp sang trọng cho không gian.</p>
      <h2>4. Kiểm Soát Nhiệt Độ</h2>
      <p>Một số mẫu vòi cảm ứng cao cấp cho phép cài đặt nhiệt độ nước mong muốn, đảm bảo an toàn và thoải mái cho người dùng.</p>
      <h3>Lưu ý khi lựa chọn</h3>
      <p>Chọn sản phẩm có chất liệu bền bỉ, chống ăn mòn. Kiểm tra pin hoặc nguồn điện cấp cho cảm biến. Lắp đặt đúng kỹ thuật để tránh trục trặc.</p>
    `,
    date: new Date('2025-05-20T10:00:00Z'),
    category: 'Thiết Bị Vệ Sinh',
    isFeatured: false,
  },
  // Bài viết 27
  {
    title: 'Tái Chế Và Tận Dụng Các Vật Dụng Cũ Trong Phòng Tắm',
    slug: 'tai-che-tan-dung-vat-dung-cu-phong-tam',
    image: '/images/news/tai-che-phong-tam.jpg',
    summary: 'Gợi ý sáng tạo cách tái chế và tận dụng những vật dụng cũ để trang trí phòng tắm, vừa tiết kiệm chi phí vừa thân thiện môi trường.',
    content: `
      <p>Tái chế vật dụng cũ không chỉ giúp bảo vệ môi trường mà còn mang lại vẻ độc đáo, cá tính cho phòng tắm của bạn.</p>
      <h2>1. Tận Dụng Chai Lọ Thủy Tinh</h2>
      <p>Các chai lọ thủy tinh cũ có thể dùng làm bình cắm hoa, lọ đựng bàn chải đánh răng, hoặc đựng xà phòng dạng lỏng.</p>
      <h2>2. Biến Tấu Thùng Gỗ Cũ</h2>
      <p>Thùng gỗ cũ có thể được làm sạch, sơn lại và dùng làm kệ đựng khăn, giấy vệ sinh hoặc các vật dụng trang trí.</p>
      <h2>3. Sử Dụng Lại Khăn Cũ</h2>
      <p>Khăn tắm cũ có thể cắt nhỏ để làm giẻ lau vệ sinh phòng tắm hoặc dùng làm thảm chùi chân tái chế.</p>
      <h2>4. Tái Chế Lon Thiếc/Nhựa</h2>
      <p>Lon thiếc hoặc hộp nhựa có thể được trang trí lại và dùng để đựng cọ trang điểm, bông tẩy trang hoặc các vật dụng nhỏ khác.</p>
      <h3>Lưu ý</h3>
      <p>Đảm bảo vật dụng tái chế được làm sạch và khô ráo hoàn toàn trước khi sử dụng trong môi trường ẩm ướt của phòng tắm.</p>
    `,
    date: new Date('2025-05-17T09:00:00Z'),
    category: 'Mẹo Vặt',
    isFeatured: false,
  },
  // Bài viết 28
  {
    title: 'Những Điều Cần Biết Về Sen Vòi Nóng Lạnh Cao Cấp',
    slug: 'sen-voi-nong-lanh-cao-cap',
    image: '/images/news/sen-voi-nong-lanh.jpg',
    summary: 'Tìm hiểu về công nghệ, chất liệu và tính năng nổi bật của sen vòi nóng lạnh cao cấp, giúp bạn lựa chọn sản phẩm bền đẹp và an toàn.',
    content: `
      <p>Sen vòi nóng lạnh cao cấp không chỉ mang lại sự tiện nghi mà còn là điểm nhấn thẩm mỹ cho phòng tắm. Dưới đây là những đặc điểm nổi bật.</p>
      <h2>1. Chất Liệu Cao Cấp</h2>
      <p>Thường được làm từ đồng thau nguyên chất mạ Crom/Niken nhiều lớp, inox 304 hoặc hợp kim cao cấp, đảm bảo độ bền, chống ăn mòn và oxy hóa.</p>
      <h2>2. Công Nghệ Hiện Đại</h2>
      <p>Tích hợp các công nghệ như điều khiển nhiệt độ chính xác (thermostatic), tiết kiệm nước (EcoSmart), hoặc công nghệ AirPower tạo dòng nước mềm mại.</p>
      <h2>3. Thiết Kế Sang Trọng</h2>
      <p>Mẫu mã đa dạng, từ cổ điển đến hiện đại, tinh tế trong từng đường nét, phù hợp với mọi phong cách thiết kế phòng tắm.</p>
      <h2>4. Tính Năng An Toàn</h2>
      <p>Có tính năng chống bỏng (khóa nhiệt độ an toàn), tự động ngắt nước khi quá nóng hoặc quá lạnh, bảo vệ người dùng.</p>
      <h2>5. Dễ Dàng Vệ Sinh</h2>
      <p>Bề mặt nhẵn bóng, ít bám bẩn và dễ dàng lau chùi, duy trì vẻ đẹp sáng bóng theo thời gian.</p>
      <h3>Lựa chọn thông minh</h3>
      <p>Ưu tiên các thương hiệu uy tín như Grohe, Hansgrohe, Toto, Kohler để đảm bảo chất lượng và dịch vụ bảo hành.</p>
    `,
    date: new Date('2025-05-14T15:00:00Z'),
    category: 'Thiết Bị Vệ Sinh',
    isFeatured: false,
  },
  // Bài viết 29
  {
    title: 'Cách Trang Trí Phòng Tắm Nhỏ Thêm Phần Độc Đáo',
    slug: 'trang-tri-phong-tam-nho-doc-dao',
    image: '/images/news/trang-tri-phong-tam.jpg',
    summary: 'Những ý tưởng trang trí sáng tạo giúp biến phòng tắm nhỏ trở nên độc đáo, phong cách mà vẫn đảm bảo sự tiện nghi.',
    content: `
      <p>Phòng tắm nhỏ không có nghĩa là phải đơn điệu. Với một chút sáng tạo, bạn có thể biến nó thành một không gian độc đáo và đầy phong cách.</p>
      <h2>1. Chọn Gam Màu Sáng và Điểm Nhấn</h2>
      <p>Sử dụng màu trắng, be hoặc các tông màu pastel làm chủ đạo để tạo cảm giác rộng rãi. Thêm điểm nhấn bằng một mảng tường màu đậm hoặc họa tiết ấn tượng.</p>
      <h2>2. Gương Lớn</h2>
      <p>Một chiếc gương lớn không chỉ tiện dụng mà còn giúp nhân đôi không gian và ánh sáng, tạo cảm giác phòng tắm rộng hơn.</p>
      <h2>3. Kệ Treo Tường Đa Năng</h2>
      <p>Tận dụng không gian theo chiều dọc bằng các kệ treo tường hoặc tủ âm tường. Chọn loại có thiết kế gọn gàng, ít chi tiết.</p>
      <h2>4. Thêm Cây Xanh</h2>
      <p>Những chậu cây nhỏ xinh hoặc cây treo tường sẽ mang lại sức sống, sự tươi mát và thanh lọc không khí cho phòng tắm.</p>
      <h2>5. Ánh Sáng Tinh Tế</h2>
      <p>Sử dụng đèn LED âm trần hoặc đèn gắn gương để tạo ánh sáng dịu nhẹ, ấm áp, tránh dùng đèn quá chói.</p>
      <h3>Lời khuyên</h3>
      <p>Hạn chế đồ đạc không cần thiết. Sử dụng các phụ kiện nhỏ gọn và có màu sắc hài hòa với tổng thể.</p>
    `,
    date: new Date('2025-05-11T10:00:00Z'),
    category: 'Nội Thất Phòng Tắm',
    isFeatured: false,
  },
  // Bài viết 30
  {
    title: 'Tìm Hiểu Về Công Nghệ Xả Xoáy Trong Bồn Cầu Hiện Đại',
    slug: 'cong-nghe-xa-xoay-bon-cau',
    image: '/images/news/cong-nghe-xa-xoay.jpg',
    summary: 'Khám phá ưu điểm và cách thức hoạt động của công nghệ xả xoáy, giúp bồn cầu sạch sẽ hơn, tiết kiệm nước và hạn chế tiếng ồn.',
    content: `
      <p>Công nghệ xả xoáy (Tornado Flush, Siphon Jet) là một trong những cải tiến quan trọng trong thiết kế bồn cầu hiện đại, mang lại hiệu quả vệ sinh vượt trội.</p>
      <h2>1. Cách Thức Hoạt Động</h2>
      <p>Thay vì xả nước theo đường thẳng truyền thống, công nghệ xả xoáy tạo ra dòng nước mạnh mẽ xoáy tròn 360 độ quanh lòng bồn. Lực xoáy này giúp cuốn trôi mọi chất thải một cách nhanh chóng và triệt để.</p>
      <h2>2. Ưu Điểm Nổi Bật</h2>
      <ul>
        <li><strong>Sạch sẽ tối ưu:</strong> Lực xoáy mạnh giúp làm sạch toàn bộ bề mặt lòng bồn, đặc biệt là dưới vành.</li>
        <li><strong>Tiết kiệm nước:</strong> Hiệu quả xả cao cho phép sử dụng lượng nước ít hơn mỗi lần xả.</li>
        <li><strong>Hạn chế tiếng ồn:</strong> Dòng nước xoáy êm ái hơn so với kiểu xả truyền thống, giảm tiếng ồn khi sử dụng.</li>
        <li><strong>Chống bám bẩn:</strong> Bề mặt bồn cầu được làm sạch liên tục, hạn chế sự hình thành vết ố và vi khuẩn.</li>
      </ul>
      <h2>3. Các Thương Hiệu Tiêu Biểu</h2>
      <p>Nhiều thương hiệu lớn như Toto, Inax, American Standard đều đã áp dụng công nghệ xả xoáy vào các dòng sản phẩm bồn cầu cao cấp của mình.</p>
      <h3>Kết luận</h3>
      <p>Công nghệ xả xoáy là một yếu tố đáng cân nhắc khi bạn muốn chọn mua một chiếc bồn cầu hiệu quả, tiết kiệm nước và bền đẹp.</p>
    `,
    date: new Date('2025-05-08T14:00:00Z'),
    category: 'Công Nghệ',
    isFeatured: true,
  },
];

async function main() {
  console.log(`Bắt đầu seeding ${newsData.length} bài viết...`);

  for (const data of newsData) {
    // Đảm bảo slug là duy nhất
    const existingPost = await prisma.news.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      console.log(`Bài viết với slug '${data.slug}' đã tồn tại. Bỏ qua.`);
      continue;
    }

    // Tạo slug từ category để đảm bảo consistency
    // const categorySlug = createCategorySlug(data.category); // Không cần dùng ở đây vì slug đã có sẵn

    await prisma.news.create({
      data: {
        title: data.title,
        slug: data.slug,
        image: data.image,
        summary: data.summary,
        content: data.content,
        date: data.date,
        category: data.category,
        isFeatured: data.isFeatured,
        views: Math.floor(Math.random() * 1000) + 100, // Random view count
      },
    });
    console.log(`Đã thêm bài viết: "${data.title}"`);
  }

  console.log('Seeding hoàn tất.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });