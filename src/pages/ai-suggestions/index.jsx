import React, { useState, useRef, useEffect } from "react";
import {
  FiMessageSquare,
  FiBook,
  FiSettings,
  FiSend,
  FiUser,
  FiPlus,
  FiMic,
  FiFileText,
  FiImage,
  FiVideo,
  FiFile,
} from "react-icons/fi";
import Button from "../../components/ui/Button";
import heroFood from "../../assets/hero-food.jpg";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";
import { motion, useAnimation } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const AISuggestions = () => {
  const controls = useAnimation();
  const attachRef = useRef(null);
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiName] = useState("BiteBot");

  const [mode, setMode] = useState("idle"); // idle | list | detail
  const [lastRecipes, setLastRecipes] = useState([]); // store last recipe names
  const [awaitingSelection, setAwaitingSelection] = useState(false); // NEW: track if waiting for number input

  const isChatEmpty = messages.length === 0;

  const sentences = [
    "What are you working on?",
    "What's on the agenda today?",
    "Where should we begin?",
    "How can I help, User?",
    "Hey, User. Ready to dive in?",
    "Good to see you, User.",
  ];

  const [welcomeSentence, setWelcomeSentence] = useState(
    sentences[Math.floor(Math.random() * sentences.length)]
  );

  // === AI Handler ===
const handleAskAI = async (e) => {
  e.preventDefault();
  const text = query.trim();
  if (!text) return;

  if (isChatEmpty) setWelcomeSentence("");
  setQuery("");
  setIsLoading(true);

  controls.start({
    x: [0, 40, -40, 0],
    y: [0, -40, 40, 0],
    rotate: [0, 15, 15, 0],
    opacity: [1, 0, 0, 1],
    transition: { duration: 0.8, ease: "easeInOut" },
  });

  setMessages((prev) => [...prev, { role: "user", text }]);

  const greetings = ["hi", "hello", "hey", "hii"];
  if (greetings.includes(text.toLowerCase())) {
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: `👋 Hello there! I'm **${aiName}**, your culinary assistant.  
Tell me what ingredients you have, and I'll suggest some dishes 🍛.`,
      },
    ]);
    setIsLoading(false);
    return;
  }

  try {
    // === User selects a recipe number ===
    if (awaitingSelection && /^\d+$/.test(text)) {
      const index = parseInt(text, 10) - 1;
      if (index < 0 || index >= lastRecipes.length) {
        setMessages((prev) => [
          ...prev,
          { 
            role: "ai", 
            text: `⚠️ Please select a number between 1 and ${lastRecipes.length}.` 
          },
        ]);
      } else {
        const recipeName = lastRecipes[index];
        const systemPrompt = `You are BiteBot, an Indian recipe assistant. Provide a detailed recipe in this EXACT structure:

# Recipe Name

**Description:** A brief description of the dish.

## Ingredients
- Ingredient 1
- Ingredient 2
- Ingredient 3

## Instructions
1. Step 1
2. Step 2  
3. Step 3

**Tips:** Helpful cooking tips.

Use proper Markdown formatting with headers, bullet points, and numbered lists.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Give me the complete recipe for: ${recipeName}. Format it exactly as requested.` },
            ],
            max_tokens: 1200,
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        let reply = data.choices?.[0]?.message?.content || "⚠️ Could not generate recipe details.";

        // Ensure proper formatting
        if (!reply.includes("#") && !reply.includes("##")) {
          reply = `# ${recipeName}\n\n${reply}`;
        }

        setMessages((prev) => [
          ...prev, 
          { 
            role: "ai", 
            text: `${reply}\n\n---\n*Want more recipes? Just tell me your ingredients!*` 
          }
        ]);
        setAwaitingSelection(false);
        setMode("detail");
      }
    }

    // === User provides ingredients (new request) ===
    else {
      const systemPrompt = `You are BiteBot, a friendly Indian recipe assistant.
IMPORTANT: When user provides ingredients, respond with ONLY this exact format:

Here are some dishes you can make with your ingredients:

1. Recipe Name 1
2. Recipe Name 2  
3. Recipe Name 3
4. Recipe Name 4
5. Recipe Name 5
6. Recipe Name 6

Type the number of the recipe you'd like to see (e.g., '1', '2', etc.)

Rules:
- Return ONLY 6 recipes maximum
- Each recipe must be on a new line starting with number and period
- No bullet points, no extra text before or after the list
- No emojis in the list
- Make sure recipes are relevant to Indian cuisine`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Ingredients: ${text}` },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      let reply = data.choices?.[0]?.message?.content || "⚠️ Could not generate recipes.";

      // Clean up and validate the response
      let cleanedReply = reply.trim();
      
      // Ensure it starts with the proper header
      if (!cleanedReply.includes("Here are some dishes")) {
        cleanedReply = "Here are some dishes you can make with your ingredients:\n\n" + cleanedReply;
      }

      // Ensure it ends with selection instruction
      if (!cleanedReply.includes("Type the number")) {
        cleanedReply += "\n\nType the number of the recipe you'd like to see (e.g., '1', '2', etc.)";
      }

      // Extract recipe names for selection
      const recipes = cleanedReply
        .split('\n')
        .filter(line => /^\d+\.\s+.+/.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(name => name.length > 0);

      if (recipes.length > 0) {
        setLastRecipes(recipes);
        setMode("list");
        setAwaitingSelection(true);
        setMessages((prev) => [...prev, { role: "ai", text: cleanedReply }]);
      } else {
        // Fallback if no recipes were parsed
        setMessages((prev) => [
          ...prev,
          { 
            role: "ai", 
            text: "I couldn't generate a proper recipe list. Please try again with different ingredients." 
          }
        ]);
        setAwaitingSelection(false);
      }
    }

  } catch (error) {
    console.error(error);
    setMessages((prev) => [
      ...prev,
      { role: "ai", text: "⚠️ Something went wrong. Please try again later." },
    ]);
    setAwaitingSelection(false);
  } finally {
    setIsLoading(false);
  }
};

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close attach menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachRef.current && !attachRef.current.contains(event.target)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update input placeholder based on state
  const getInputPlaceholder = () => {
    if (awaitingSelection) {
      return "Enter recipe number (e.g., 1, 2, 3...)";
    }
    return "Enter your ingredients or mood here...";
  };

  return (
    <div className="flex h-screen bg-background text-foreground relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${heroFood})`, filter: "blur(5px)" }}
      />

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute left-3 top-4 w-8 h-8 flex flex-col items-center justify-center rounded-md bg-primary text-white shadow-md hover:bg-primary/90 transition-all z-50"
      >
        <div className="space-y-[4px]">
          <span className="block w-4 h-[2px] bg-white"></span>
          <span className="block w-4 h-[2px] bg-white"></span>
          <span className="block w-4 h-[2px] bg-white"></span>
        </div>
      </button>

      <aside
        className={`mt-12 fixed top-0 left-0 h-full bg-popover/90 border-r border-none flex flex-col transform transition-transform duration-500 ease-in-out z-40
        ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}
      >
        <div className="flex items-center gap-3 p-4 border-b border-none">
          <div className="flex items-center justify-center w-11 h-11 bg-primary rounded-lg">
            <span className="text-white text-xl font-bold">HB</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-heading font-semibold text-white">HeritageBites</span>
            <h1 className="text-sm font-semibold text-white">{aiName} Assistant</h1>
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto p-3 space-y-2 text-white">
          <button 
            onClick={() => {
              setMessages([]);
              setMode("idle");
              setAwaitingSelection(false);
              setLastRecipes([]);
            }}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl hover:bg-primary transition"
          >
            <FiMessageSquare /> Start New Chat
          </button>
          <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl hover:bg-primary transition">
            <FiBook /> My Saved Recipes
          </button>
          <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl hover:bg-primary transition">
            <FiSettings /> Settings
          </button>
        </div>
      </aside>

      <div className={`flex flex-col flex-1 ${isChatEmpty ? "justify-center items-center" : ""}`}>
        <header className="p-4 pl-16 border-b bg-popover/90 flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-yellow-500 rounded-full">
            <Icon name="Sparkles" size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-white">{aiName} Assistant</h1>
        </header>

        {!isChatEmpty && (
          <main className="flex-1 overflow-y-auto px-4 py-6 relative z-10">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {m.role === "ai" ? (
                    <>
                      <div className="w-8 h-8 flex items-center justify-center bg-yellow-500 rounded-full">
                        <Icon name="Sparkles" size={20} className="text-white" />
                      </div>
                      <div className="px-4 py-2 rounded-2xl text-base shadow max-w-2xl border border-[#F9BC06] bg-[#FFF7E6] text-black">
  <ReactMarkdown 
    remarkPlugins={[remarkGfm]} 
    rehypePlugins={[rehypeRaw]}
    components={{
      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2 text-orange-600" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-2 text-orange-500" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-lg font-medium mt-2 mb-1 text-orange-400" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
      li: ({node, ...props}) => <li className="my-1" {...props} />,
      p: ({node, ...props}) => <p className="my-2" {...props} />,
      strong: ({node, ...props}) => <strong className="font-bold" {...props} />
    }}
  >
    {m.text}
  </ReactMarkdown>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="px-4 py-2 rounded-2xl text-base shadow max-w-3xl text-white"
                        style={{ background: "linear-gradient(to right, #f87d46, #fa874f)" }}
                      >
  <ReactMarkdown 
    remarkPlugins={[remarkGfm]} 
    rehypePlugins={[rehypeRaw]}
    components={{
      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2 text-orange-600" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-2 text-orange-500" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-lg font-medium mt-2 mb-1 text-orange-400" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
      li: ({node, ...props}) => <li className="my-1" {...props} />,
      p: ({node, ...props}) => <p className="my-2" {...props} />,
      strong: ({node, ...props}) => <strong className="font-bold" {...props} />
    }}
  >
    {m.text}
  </ReactMarkdown>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-[#f87d46] to-[#fa874f] rounded-full">
                        <FiUser className="text-white text-xl" />
                      </div>
                    </>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 mt-2">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-yellow-500 rounded-full">
                      <Icon name="Sparkles" size={20} className="text-white" />
                    </div>
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="px-4 py-2 rounded-2xl text-base shadow bg-[#FFF7E6] border border-[#F9BC06]"
                  >
                    {aiName} is thinking...
                  </motion.div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </main>
        )}

        <form onSubmit={handleAskAI} className={`p-4 border-t bg-popover/90 ${isChatEmpty ? "flex flex-col justify-center items-center" : ""}`}>
          {isChatEmpty && (
            <h1 className="text-3xl font-semibold text-white mb-4">{welcomeSentence || "What can I help with?"}</h1>
          )}

          <div className={`flex gap-2 items-center ${isChatEmpty ? "max-w-3xl w-full" : "max-w-4xl mx-auto"}`}>
            <div ref={attachRef} className="relative flex-1">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="absolute left-2 top-[30%] text-xl text-primary"
              >
                <FiPlus />
              </button>

              {showAttachMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 bottom-14 bg-white border rounded-xl shadow-lg w-44 z-10"
                >
                  <ul className="flex flex-col text-sm text-gray-700">
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <FiImage /> Photos
                    </li>
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <FiVideo /> Videos
                    </li>
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <FiFile /> Documents
                    </li>
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <FiFileText /> Notes
                    </li>
                  </ul>
                </motion.div>
              )}

              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="w-full h-12 pl-10 pr-12 py-3 rounded-xl border-2 border-gray-300"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-primary cursor-pointer">
                <FiMic />
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white flex items-center justify-center gap-2"
              disabled={!query.trim()}
            >
              <motion.div animate={controls}>
                <FiSend className="text-lg" />
              </motion.div>
              <span className="hidden md:inline">
                {awaitingSelection ? "Get Recipe" : "Send"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISuggestions;