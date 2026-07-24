import { useState } from 'react';

export const useNavigation = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedFloor, setSelectedFloor] = useState(null);

  const navigateTo = (page) => {
    setActivePage(page);
  };

  const selectFloor = (floorId) => {
    setSelectedFloor(floorId);
    navigateTo('floor');
  };

  return {
    activePage,
    selectedFloor,
    navigateTo,
    selectFloor,
  };
};
