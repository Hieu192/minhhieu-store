export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      <div className="flex justify-center items-center py-20">
        <div className="flex space-x-2">
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-custom"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
