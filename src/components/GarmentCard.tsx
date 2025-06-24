
interface Garment {
  id: string;
  name: string;
  brand: string;
  color: string;
  type: string;
  image: string;
  tags: string[];
}

interface GarmentCardProps {
  garment: Garment;
}

export const GarmentCard = ({ garment }: GarmentCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={garment.image}
          alt={garment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 truncate">{garment.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{garment.brand}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-purple-600">{garment.type}</span>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: garment.color.toLowerCase() === 'white' ? '#f3f4f6' : garment.color.toLowerCase() }}
            />
            <span className="text-xs text-gray-500">{garment.color}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {garment.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {garment.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{garment.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
