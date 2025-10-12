import { useState } from "react";

const recipes = [
  {
    name: "Masala Khichdi",
    ingredients: ["rice", "moong dal", "turmeric", "ghee", "cumin"],
    steps: [
      "Wash and soak rice and dal.",
      "Cook them together with turmeric and salt.",
      "Add ghee and cumin for flavor."
    ]
  },
  {
    name: "Aloo Paratha",
    ingredients: ["potato", "wheat flour", "salt", "chili", "ghee"],
    steps: [
      "Boil and mash potatoes.",
      "Add spices and stuff into dough.",
      "Roll and cook on tawa with ghee."
    ]
  },
  {
    name: "Tomato Rice",
    ingredients: ["rice", "tomato", "onion", "garlic", "chili"],
    steps: [
      "Cook rice separately.",
      "Sauté onion, tomato, and spices.",
      "Mix cooked rice with the masala."
    ]
  },
  {
    name: "Vegetable Pulao",
    ingredients: ["rice", "carrot", "peas", "beans", "spices"],
    steps: [
      "Fry whole spices, add veggies and rice.",
      "Add water and cook until done.",
      "Serve with raita."
    ]
  }
];

function findBestRecipe(userIngredients) {
  let bestMatch = null;
  let maxMatch = 0;

  recipes.forEach(recipe => {
    const matches = recipe.ingredients.filter(i =>
      userIngredients.includes(i.toLowerCase().trim())
    ).length;

    if (matches > maxMatch) {
      maxMatch = matches;
      bestMatch = recipe;
    }
  });

  return bestMatch;
}

export default function AISuggestions() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = () => {
    if (!input.trim()) return;

    const userIngredients = input.split(",");
    const recipe = findBestRecipe(userIngredients);

    if (recipe) {
      setResponse(recipe);
    } else {
      setResponse({ name: "No match found", steps: ["Try different ingredients!"] });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center text-green-700">AI Recipe Suggestion</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Enter ingredients (e.g. rice, tomato, onion)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Get Recipe
      </button>

      {response && (
        <div className="bg-gray-50 border p-4 rounded mt-4">
          <h2 className="text-xl font-semibold mb-2">{response.name}</h2>
          <h3 className="font-medium">Steps:</h3>
          <ul className="list-disc list-inside">
            {response.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
