import { Item } from "@/utils/api";

interface InventoryItemRowProps {
  item: Item;
  isAdmin: boolean;
  onDeleteClick: (item: Item) => void;
}

export function InventoryItemRow({ item, isAdmin, onDeleteClick }: InventoryItemRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {item.category_name}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.supplier_name ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {item.supplier_name}
          </span>
        ) : (
          <span className="text-gray-400">Not specified</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className={`${item.stock <= 10 ? 'text-red-600 font-medium' : ''}`}>
          {item.stock}
        </span>
      </td>
      {isAdmin && (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <a href={`/inventory/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer">
            Edit
          </a>
          <button 
            className="text-red-600 hover:text-red-900 cursor-pointer"
            onClick={() => onDeleteClick(item)}
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );
}