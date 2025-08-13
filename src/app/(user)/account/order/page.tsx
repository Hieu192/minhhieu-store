export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Lịch sử đơn hàng</h1>

        <div className="border border-gray-200 rounded-lg divide-y">
          {[1, 2].map((id) => (
            <div key={id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Đơn hàng #{1000 + id}</p>
                <p className="text-sm text-gray-500">Ngày: 2025-06-23</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">1.500.000đ</p>
                <p className="text-sm text-green-600">Đã giao</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
