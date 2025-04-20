import { useState } from "react";
import { Item, deleteItem as apiDeleteItem } from "@/utils/api";

export function useDeleteDialog() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (item: Item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
    setDeleteError("");
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
    setDeleteError("");
  };

  const handleDeleteItem = async (onSuccess: (deletedItemId: number) => void) => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    setDeleteError("");
    
    try {
      await apiDeleteItem(itemToDelete.id);
      onSuccess(itemToDelete.id);
      closeDeleteModal();
    } catch (error: any) {
      setDeleteError(error.message || "Failed to delete item. Please try again.");
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteState: {
      isOpen: deleteModalOpen,
      itemToDelete,
      deleteError,
      isDeleting
    },
    deleteActions: {
      openDeleteModal,
      closeDeleteModal,
      handleDeleteItem
    }
  };
}