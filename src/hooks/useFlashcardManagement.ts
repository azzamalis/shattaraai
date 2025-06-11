
import { useState } from 'react';

export function useFlashcardManagement() {
  const [showManagement, setShowManagement] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleManageCards = () => {
    setShowManagement(true);
  };

  const handleEditCard = () => {
    setShowManagement(true);
  };

  const handleBackFromManagement = () => {
    setShowManagement(false);
  };

  const handleOpenFilter = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilter = () => {
    setShowFilterModal(false);
  };

  return {
    showManagement,
    showFilterModal,
    handleManageCards,
    handleEditCard,
    handleBackFromManagement,
    handleOpenFilter,
    handleCloseFilter
  };
}
