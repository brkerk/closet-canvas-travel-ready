
export const OutfitRecommendations = () => {
  const outfitSuggestions = [
    {
      id: 1,
      name: "Business Casual",
      weather: "72°F • Sunny",
      items: ["Navy Blazer", "White Shirt", "Black Jeans"],
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
      confidence: 95,
    },
    {
      id: 2,
      name: "Weekend Brunch",
      weather: "72°F • Sunny",
      items: ["White Cotton Shirt", "Black Jeans", "Red Scarf"],
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
      confidence: 88,
    },
    {
      id: 3,
      name: "Evening Out",
      weather: "68°F • Clear",
      items: ["Navy Blazer", "Black Jeans", "Red Scarf"],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
      confidence: 92,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Recommendations</h2>
        <p className="text-gray-600 mb-6">AI-powered outfit suggestions based on weather and your style</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {outfitSuggestions.map((outfit) => (
            <div key={outfit.id} className="group">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">{outfit.name}</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-600">{outfit.confidence}%</span>
                  </div>
                </div>
                
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4">
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">{outfit.weather}</p>
                  
                  <div className="space-y-1">
                    {outfit.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl hover:shadow-md transition-all duration-200">
                    Wear This Outfit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Style Preferences</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Casual", "Business", "Formal", "Trendy", "Vintage", "Minimalist", "Bohemian", "Sporty"].map((style) => (
            <button
              key={style}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
