import React from "react";
import { X, Salad, ChefHat, Lightbulb, Apple } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RecipeDetailModal = ({ recipe, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 
          rounded-2xl shadow-2xl border border-border/40 w-[90%] max-w-2xl p-8 overflow-y-auto max-h-[80vh] mt-20"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* ❌ Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          >
            <X size={22} />
          </button>

          {/* 🍽️ Recipe Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {recipe.title}
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {recipe.description}
            </p>
          </div>

          {/* 🥗 Ingredients */}
          {recipe.ingredients?.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Salad className="text-green-600" size={20} />
                <h3 className="text-lg font-semibold text-foreground">Ingredients</h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-sm text-muted-foreground list-disc list-inside">
                {recipe.ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 👨‍🍳 Steps */}
          {recipe.instructions?.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="text-orange-600" size={20} />
                <h3 className="text-lg font-semibold text-foreground">Steps to Make</h3>
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>
          )}

          {/* 💡 Match Insight */}
          {recipe.matchReason && (
            <section className="mb-6 bg-green-50/60 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="text-green-700" size={20} />
                <h3 className="text-lg font-semibold text-foreground">How This Matches You</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{recipe.matchReason}</p>
            </section>
          )}

          {/* 🍎 Nutrition Info */}
          {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
            <section className="mb-6 bg-orange-50/60 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Apple className="text-orange-700" size={20} />
                <h3 className="text-lg font-semibold text-foreground">Nutrition (per serving)</h3>
              </div>
              <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-y-1">
                {Object.entries(recipe.nutrition).map(([key, value], i) => (
                  <li key={i}>
                    <strong className="text-foreground">{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ✅ Close button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="bg-primary text-white font-medium px-6 py-2 rounded-lg shadow-md 
              hover:bg-primary/90 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeDetailModal;
