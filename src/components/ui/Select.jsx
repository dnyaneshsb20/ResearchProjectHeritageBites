import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ label, options, value, onChange, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
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
    if (disabled) return; // prevent selection when disabled
    onChange(val);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  return (
    <div ref={selectRef} className="relative">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`w-full border rounded-md px-3 py-2 text-left flex items-center justify-between transition ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
            : 'bg-background cursor-pointer'
        }`}
      >
        <span>
          {options.find((o) => o.value === value)?.label || placeholder || 'Select an option'}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } text-muted-foreground`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
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
