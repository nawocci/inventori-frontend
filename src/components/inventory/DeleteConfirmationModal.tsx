import { Item } from "@/utils/api";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemToDelete: Item | null;
  isDeleting: boolean;
  deleteError: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  itemToDelete, 
  isDeleting, 
  deleteError,
  onClose, 
  onConfirm 
}: DeleteConfirmationModalProps) {
  if (!isOpen || !itemToDelete) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete <span className="font-semibold">{itemToDelete.name}</span>? 
          This action cannot be undone.
        </p>
        
        {deleteError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {deleteError}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 cursor-pointer"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}