export const ProfilePage = () => (
  <div className="p-8 max-w-2xl mx-auto">
    <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
      <div className="w-24 h-24 rounded-full bg-blue-100 text-[#1565c0] text-3xl font-bold flex items-center justify-center mx-auto mb-4 border-4 border-[#1565c0]">O1</div>
      <h2 className="text-2xl font-bold text-gray-800">Operator 01</h2>
      <p className="text-gray-500 mb-6">Administrator Jaringan</p>
      <div className="text-left space-y-4">
        <div><label className="text-xs font-bold text-gray-500">Email:</label><p className="font-medium">operator@netmonitor.com</p></div>
        <div><label className="text-xs font-bold text-gray-500">Role:</label><p className="font-medium">Super Admin</p></div>
        <button className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 w-full">Ubah Password</button>
      </div>
    </div>
  </div>
);
