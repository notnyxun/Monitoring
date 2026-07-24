export const Sidebar = ({ activePage, navigateTo }) => (
  <aside className="w-64 bg-[#1565c0] text-white flex flex-col justify-between shrink-0">
    <div>
      <div className="h-16 flex items-center px-6 border-b border-blue-500/30">
        <span 
          className="font-bold text-lg tracking-wider cursor-pointer" 
          onClick={() => navigateTo('dashboard')}
        >
          NetMonitor
        </span>
      </div>
      <nav className="mt-6 px-4 space-y-2">
        <button 
          onClick={() => navigateTo('dashboard')} 
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            activePage === 'dashboard' || activePage === 'floor' 
              ? 'bg-white/20 font-bold' 
              : 'hover:bg-white/10'
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => navigateTo('logs')} 
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            activePage === 'logs' 
              ? 'bg-white/20 font-bold' 
              : 'hover:bg-white/10'
          }`}
        >
          Logs
        </button>
        <button 
          onClick={() => navigateTo('config')} 
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            activePage === 'config' 
              ? 'bg-white/20 font-bold' 
              : 'hover:bg-white/10'
          }`}
        >
          Configuration
        </button>
      </nav>
    </div>
    <div 
      className="p-4 mb-4 mx-4 bg-black/10 rounded-lg flex items-center cursor-pointer hover:bg-black/20" 
      onClick={() => navigateTo('profile')}
    >
      <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-bold">
        O1
      </div>
      <div className="ml-3 text-left">
        <p className="text-sm font-semibold">Operator 01</p>
        <p className="text-xs text-blue-200">Online | Responsive</p>
      </div>
    </div>
  </aside>
);
