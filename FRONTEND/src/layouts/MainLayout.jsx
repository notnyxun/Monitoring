import { useState } from 'react';
import { Sidebar } from '../components/shared/Sidebar';
import { Header } from '../components/shared/Header';
import { NotifikasiModal } from '../components/shared/NotifikasiModal';

export const MainLayout = ({ 
  activePage, 
  selectedFloor, 
  navigateTo, 
  notifikasiList, 
  children 
}) => {
  const [showNotifModal, setShowNotifModal] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-gray-800">
      {/* SIDEBAR */}
      <Sidebar 
        activePage={activePage} 
        navigateTo={navigateTo} 
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <Header 
          activePage={activePage}
          selectedFloor={selectedFloor}
          navigateTo={navigateTo}
          notifikasiList={notifikasiList}
          onNotifikasiClick={() => setShowNotifModal(true)}
        />

        {/* PAGE CONTENT */}
        <div className="overflow-y-auto h-full">
          {children}
        </div>
      </main>

      {/* NOTIFIKASI MODAL */}
      <NotifikasiModal 
        notifikasiList={notifikasiList} 
        isOpen={showNotifModal} 
        onClose={() => setShowNotifModal(false)} 
      />
    </div>
  );
};
