import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react'; // ✅ using lucide-react icons (already available in your project)

const Select = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-md px-3 py-2 text-left bg-background flex items-center justify-between"
      >
        <span>
          {options.find((o) => o.value === value)?.label || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } text-muted-foreground`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
