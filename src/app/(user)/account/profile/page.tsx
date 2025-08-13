export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Thông tin cá nhân</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ tên</label>
            <input
              type="text"
              defaultValue="Nguyễn Văn A"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              defaultValue="admin@example.com"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              defaultValue="0123 456 789"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}
