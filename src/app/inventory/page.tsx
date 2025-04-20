"use client";

import { useAuth } from "@/hooks/useAuth";
import { useInventoryData } from "@/hooks/inventory/useInventoryData";
import { useInventoryFilters } from "@/hooks/inventory/useInventoryFilters";
import { useDeleteDialog } from "@/hooks/inventory/useDeleteDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { FilterPanel } from "@/components/inventory/FilterPanel";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { DeleteConfirmationModal } from "@/components/inventory/DeleteConfirmationModal";

export default function Inventory() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const { items, setItems, categories, suppliers, isLoading } = useInventoryData();
  const { filteredItems, selectedCategory, selectedSupplier, handleCategoryChange, handleSupplierChange } = useInventoryFilters(items);
  const { deleteState, deleteActions } = useDeleteDialog();

  const handleSuccessfulDelete = (deletedItemId: number) => {
    const updatedItems = items.filter(item => item.id !== deletedItemId);
    setItems(updatedItems);
  };

  if (isLoading) {
    return (
      <main className="p-6">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <FilterPanel 
          filteredItemsCount={filteredItems.length}
          categories={categories}
          suppliers={suppliers}
          selectedCategory={selectedCategory}
          selectedSupplier={selectedSupplier}
          handleCategoryChange={handleCategoryChange}
          handleSupplierChange={handleSupplierChange}
        />
        
        {isAdmin && (
          <div>
            <a 
              href="/inventory/add" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Add New Item
            </a>
          </div>
        )}
      </div>

      <InventoryTable 
        items={filteredItems} 
        isAdmin={isAdmin} 
        onDeleteClick={deleteActions.openDeleteModal} 
      />

      <DeleteConfirmationModal 
        isOpen={deleteState.isOpen}
        itemToDelete={deleteState.itemToDelete}
        isDeleting={deleteState.isDeleting}
        deleteError={deleteState.deleteError}
        onClose={deleteActions.closeDeleteModal}
        onConfirm={() => deleteActions.handleDeleteItem(handleSuccessfulDelete)}
      />
    </main>
  );
}