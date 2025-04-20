import { Item } from "@/utils/api";
import { InventoryItemRow } from "./InventoryItemRow";

interface InventoryTableProps {
  items: Item[];
  isAdmin: boolean;
  onDeleteClick: (item: Item) => void;
}

export function InventoryTable({ items, isAdmin, onDeleteClick }: InventoryTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            {isAdmin && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length > 0 ? (
            items.map((item) => (
              <InventoryItemRow 
                key={item.id} 
                item={item} 
                isAdmin={isAdmin} 
                onDeleteClick={onDeleteClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                No inventory items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}