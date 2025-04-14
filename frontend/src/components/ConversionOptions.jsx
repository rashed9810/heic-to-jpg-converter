import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineAdjustments,
  HiOutlinePhotograph,
  HiOutlineRefresh,
} from "react-icons/hi";
import Button from "./ui/Button";

const ConversionOptions = ({ onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({
    quality: 95,
    resize: false,
    width: "",
    height: "",
    maintain_aspect_ratio: true,
    rotate: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const newValue = type === "checkbox" ? checked : value;

    // Update options
    const updatedOptions = {
      ...options,
      [name]:
        type === "number" ? (value === "" ? "" : Number(value)) : newValue,
    };

    setOptions(updatedOptions);
    onChange(updatedOptions);
  };

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const qualityPresets = [
    { label: "Low", value: 50, description: "Smaller file size" },
    { label: "Medium", value: 75, description: "Balanced" },
    { label: "High", value: 90, description: "Better quality" },
    { label: "Maximum", value: 100, description: "Best quality" },
  ];

  const setQualityPreset = (value) => {
    const updatedOptions = {
      ...options,
      quality: value,
    };
    setOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center justify-between w-full mb-3 text-gray-700 border-gray-300 shadow-sm"
        onClick={toggleOptions}
      >
        <div className="flex items-center">
          <HiOutlineAdjustments className="w-5 h-5 mr-2 text-primary-500" />
          <span>Conversion Options</span>
        </div>
        {isOpen ? (
          <HiOutlineChevronUp className="w-5 h-5 ml-2" />
        ) : (
          <HiOutlineChevronDown className="w-5 h-5 ml-2" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Quality Presets */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <HiOutlinePhotograph className="w-4 h-4 mr-1.5 text-primary-500" />
                  JPEG Quality Presets
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {qualityPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setQualityPreset(preset.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                        options.quality === preset.value
                          ? "bg-primary-50 border-primary-300 ring-2 ring-primary-200"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {preset.label}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center justify-between">
                  <span>JPEG Quality</span>
                  <span className="text-primary-600 font-semibold">
                    {options.quality}%
                  </span>
                </label>
                <input
                  type="range"
                  name="quality"
                  min="1"
                  max="100"
                  value={options.quality}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              {/* Resize Options */}
              <div className="mb-5">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    name="resize"
                    id="resize"
                    checked={options.resize}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="resize"
                    className="ml-2 text-sm font-medium text-gray-700 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5 text-primary-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                    Resize Image
                  </label>
                </div>

                {options.resize && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid grid-cols-2 gap-4 mt-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label
                          htmlFor="width"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Width (px)
                        </label>
                        <input
                          type="number"
                          name="width"
                          id="width"
                          value={options.width}
                          onChange={handleChange}
                          placeholder="Auto"
                          min="1"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="height"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Height (px)
                        </label>
                        <input
                          type="number"
                          name="height"
                          id="height"
                          value={options.height}
                          onChange={handleChange}
                          placeholder="Auto"
                          min="1"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-2 mt-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="maintain_aspect_ratio"
                            id="maintain_aspect_ratio"
                            checked={options.maintain_aspect_ratio}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <label
                            htmlFor="maintain_aspect_ratio"
                            className="ml-2 text-xs font-medium text-gray-700"
                          >
                            Maintain aspect ratio
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Rotation */}
              <div>
                <label
                  htmlFor="rotate"
                  className="block mb-2 text-sm font-medium text-gray-700 flex items-center"
                >
                  <HiOutlineRefresh className="w-4 h-4 mr-1.5 text-primary-500" />
                  Rotation
                </label>
                <select
                  name="rotate"
                  id="rotate"
                  value={options.rotate}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">No rotation</option>
                  <option value="90">90° clockwise</option>
                  <option value="180">180°</option>
                  <option value="270">90° counterclockwise</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversionOptions;
