import React, { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiBook, FiSettings, FiSend, FiUser, FiPlus, FiMic, FiFileText, FiImage, FiVideo, FiFile } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";
import { motion, useAnimation } from "framer-motion";

const AISuggestions = () => {
  const controls = useAnimation();
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const chatEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const isChatEmpty = messages.length === 0;

  const sentences = [
    "What are you working on?",
    "What’s on the agenda today?",
    "What are you working on?",
    "Where should we begin?",
    "How can I help, User?",
    "Hey, User. Ready to dive in?",
    "Good to see you, User."
  ];

  const [welcomeSentence, setWelcomeSentence] = useState(
    sentences[Math.floor(Math.random() * sentences.length)]
  );

  const handleAskAI = async (e) => {
    e.preventDefault();
    const text = query.trim();
    if (!text) return;

    // Remove welcome sentence on first user message
    if (isChatEmpty) setWelcomeSentence("");

    controls.start({
      x: [0, 40, -40, 0],
      y: [0, -40, 40, 0],
      rotate: [0, 15, 15, 0],
      opacity: [1, 0, 0, 1],
      transition: { duration: 0.8, ease: "easeInOut" },
    });

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuery("");
    const greetings = ["hi", "hello", "hey", "hii"];
    if (greetings.includes(text.toLowerCase())) {
      setMessages((prev) => [...prev, { role: "ai", text: "Hello! Tell me what ingredients you have, and I’ll suggest a dish for you." }]);
      return;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful Indian recipe assistant." },
            {
              role: "user", content: `
Suggest a recipe for: ${text}.
Return it strictly in JSON format:
{ "name": "", "ingredients": [""], "steps": [""] }
` },
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a recipe.";

      let recipe;
      try {
        const cleaned = reply.replace(/```json|```/g, "").trim();
        recipe = JSON.parse(cleaned);
      } catch {
        recipe = { name: "Recipe", ingredients: [], steps: [reply] };
      }

      const formattedReply = (
        <div>
          <h2 className="font-semibold text-lg">{recipe.name}</h2>
          <h3 className="mt-2 font-medium">Ingredients:</h3>
          <ul className="list-disc ml-5">
            {recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
          <h3 className="mt-2 font-medium">Steps:</h3>
          <ol className="list-decimal ml-5">
            {recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}
          </ol>
        </div>
      );

      setMessages((prev) => [...prev, { role: "ai", text: formattedReply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "ai", text: "⚠️ Sorry, something went wrong. Please try again." }]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={`relative ${isSidebarOpen ? "w-64" : "w-20"} bg-popover border-r border-border flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="flex items-center justify-center w-11 h-11 bg-primary rounded-lg">
            <span className="text-white text-xl font-bold">HB</span>
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-xl font-heading font-semibold text-foreground">HeritageBites</span>
              <h1 className="text-sm font-semibold text-foreground/80">AI Recipe Assistant</h1>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-all"
          title={isSidebarOpen ? "Collapse" : "Expand"}
        >
          {isSidebarOpen ? "<" : ">"}
        </button>

        <div className="flex flex-col flex-1 overflow-y-auto p-3 space-y-2">
          <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl hover:bg-muted transition">
            <FiMessageSquare className="text-lg" />
            {isSidebarOpen && <span className="font-medium">Start New Chat</span>}
          </button>
          <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl hover:bg-muted transition">
            <FiBook className="text-lg" />
            {isSidebarOpen && <span className="font-medium">My Saved Recipes</span>}
          </button>
          <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl hover:bg-muted transition">
            <FiSettings className="text-lg" />
            {isSidebarOpen && <span className="font-medium">Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className={`flex flex-col flex-1 transition-all duration-500 ${isChatEmpty ? "justify-center items-center" : ""}`}>
        <header className="p-4 border-b border-border bg-popover flex items-center gap-3">
          <Icon name="Sparkles" size={20} />
          <h1 className="text-lg font-semibold">AI Recipe Assistant</h1>
        </header>

        {!isChatEmpty && (
          <main className="flex-1 overflow-y-auto px-4 py-6 bg-[#FFFDF9]">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                  {m.role === "ai" ? (
                    <>
                      <div className="flex-shrink-0 mt-[2px]"><Icon name="Sparkles" size={20} /></div>
                      <div className="px-4 py-2 rounded-2xl text-base shadow break-words inline-block max-w-max" style={{ background: "#FFF7E6", color: "#000", border: "1px solid #F9BC06" }}>
                        {m.text}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 rounded-2xl text-base shadow break-words inline-block max-w-max" style={{ background: "linear-gradient(to right, #f87d46, #fa874f)", color: "#fff" }}>
                        {m.text}
                      </div>
                      <div className="flex-shrink-0 mt-[2px]"><FiUser className="text-primary text-xl" /></div>
                    </>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </main>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleAskAI}
          className={`p-4 border-t border-border bg-popover transition-all duration-500 ${isChatEmpty
            ? "border-none bg-transparent flex flex-col justify-center items-center h-full text-center"
            : ""
            }`}
        >
          {isChatEmpty && (
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-foreground/90">
                {welcomeSentence || "What can I help with?"}
              </h1>
            </div>
          )}

          <div
            className={`flex gap-2 items-center justify-center transition-all duration-500 ${isChatEmpty ? "w-full max-w-3xl" : "max-w-4xl mx-auto"
              }`}
          >
            {/* Input Section */}
            <div className="relative flex-1 w-full max-w-[800px]">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xl text-primary z-10"
              >
                <FiPlus />
              </button>

              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your ingredients or mood here..."
                className="w-full h-12 pl-10 pr-12 py-3 rounded-xl border-2 border-gray-300"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-primary cursor-pointer">
                <FiMic />
              </div>
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              variant="hero"
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-[#fdfbff] flex items-center gap-2 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!query.trim()}
            >
              <motion.div animate={controls} className="flex items-center">
                <FiSend className="text-lg" />
              </motion.div>
              <span>Send Recipe</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISuggestions;
