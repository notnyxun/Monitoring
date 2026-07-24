export const LoginPage = ({ onLogin }) => (
  <div className="flex h-screen bg-gray-100 items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md w-96 border-t-4 border-[#1565c0]">
      <h1 className="text-2xl font-bold text-center text-[#1565c0] mb-6">NetMonitor</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" defaultValue="operator@netmonitor.com" className="mt-1 w-full p-2 border rounded-md focus:ring-[#1565c0] focus:border-[#1565c0]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" defaultValue="password123" className="mt-1 w-full p-2 border rounded-md focus:ring-[#1565c0] focus:border-[#1565c0]" />
        </div>
        <button onClick={onLogin} className="w-full bg-[#1565c0] text-white p-2 rounded-md hover:bg-blue-700 font-semibold transition">
          Login ke Dashboard
        </button>
      </div>
    </div>
  </div>
);
