
import { useState } from "react";

export const ClosetLayout = () => {
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null);

  // Mock closet layout - 4x3 grid representing shelves/compartments
  const closetGrid = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    items: index < 6 ? Math.floor(Math.random() * 4) + 1 : 0, // Random items in first 6 shelves
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Closet Layout</h2>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          {closetGrid.map((shelf) => (
            <div
              key={shelf.id}
              onClick={() => setSelectedShelf(shelf.id)}
              className={`aspect-square border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                selectedShelf === shelf.id
                  ? "border-purple-400 bg-purple-50"
                  : shelf.items > 0
                  ? "border-pink-300 bg-pink-50 hover:bg-pink-100"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Shelf {shelf.id}</p>
                {shelf.items > 0 ? (
                  <div className="space-y-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg mx-auto"></div>
                    <p className="text-xs font-medium text-gray-700">{shelf.items} items</p>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-1"></div>
                    <p className="text-xs">Empty</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedShelf && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Shelf {selectedShelf} Details
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Drag and drop garments to organize your closet layout
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors">
                Add Items
              </button>
              <button className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg text-sm hover:bg-purple-50 transition-colors">
                Remove Items
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl text-left hover:shadow-md transition-all">
            <h4 className="font-medium text-gray-800">Auto-Organize</h4>
            <p className="text-sm text-gray-600 mt-1">Organize by color & type</p>
          </button>
          <button className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl text-left hover:shadow-md transition-all">
            <h4 className="font-medium text-gray-800">Seasonal Sort</h4>
            <p className="text-sm text-gray-600 mt-1">Group by season</p>
          </button>
          <button className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl text-left hover:shadow-md transition-all">
            <h4 className="font-medium text-gray-800">Save Layout</h4>
            <p className="text-sm text-gray-600 mt-1">Store current setup</p>
          </button>
        </div>
      </div>
    </div>
  );
};
