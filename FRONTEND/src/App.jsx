import { useState } from 'react';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardHome } from './components/pages/DashboardHome';
import { LogsPage } from './components/pages/LogsPage';
import { ConfigPage } from './components/pages/ConfigPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { FloorDetail } from './components/pages/FloorDetail';
import { MainLayout } from './layouts/MainLayout';
import { useNotifikasi, useNavigation } from './hooks';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { notifikasiList, refetch: refetchNotifikasi } = useNotifikasi();
  const { activePage, selectedFloor, navigateTo, selectFloor } = useNavigation();

  // Jika belum login, tampilkan halaman login
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // Render page content berdasarkan activePage
  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardHome onSelectFloor={selectFloor} />;
      case 'floor':
        return <FloorDetail idLantai={selectedFloor} />;
      case 'logs':
        return <LogsPage />;
      case 'config':
        return <ConfigPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardHome onSelectFloor={selectFloor} />;
    }
  };

  return (
    <MainLayout
      activePage={activePage}
      selectedFloor={selectedFloor}
      navigateTo={navigateTo}
      notifikasiList={notifikasiList}
      onNotifikasiCleared={refetchNotifikasi}
    >
      {renderPageContent()}
    </MainLayout>
  );
}
