import React from "react";
import { X } from "lucide-react";

const RecipeDetailModal = ({ recipe, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-2xl relative shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        {/* Recipe Title */}
        <h2 className="text-2xl font-bold mb-3 text-center text-gray-900">
          {recipe.title}
        </h2>

        {/* Description */}
        <p className="text-gray-700 mb-6 text-center">
          {recipe.description}
        </p>

        {/* 🥗 Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              🥗 Ingredients
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {recipe.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 👨‍🍳 Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">
              👨‍🍳 Steps to Make
            </h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* 💡 User Match Insight */}
        {recipe.matchReason && (
          <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              💡 How This Matches Your Profile
            </h3>
            <p className="text-gray-700">{recipe.matchReason}</p>
          </div>
        )}

        {/* 🍎 Nutrition Info */}
        {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
          <div className="mb-6 bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              🍎 Nutrition Information (per serving)
            </h3>
            <ul className="text-gray-700">
              {Object.entries(recipe.nutrition).map(([key, value], i) => (
                <li key={i}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Close button */}
        <button
          className="mt-4 w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailModal;
