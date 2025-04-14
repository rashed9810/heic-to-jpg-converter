import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineDownload,
  HiOutlineInformationCircle,
  HiOutlinePhotograph,
  HiOutlineDocumentDuplicate,
  HiOutlineClock,
  HiOutlineCheck,
} from "react-icons/hi";
import { formatFileSize } from "../utils/api";
import { calculateCompressionRatio, formatTime } from "../utils/fileUtils";
import Button from "./ui/Button";
import { Card, CardContent, CardFooter } from "./ui/Card";

const ConversionResult = ({ result, onDownload, className }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const compressionRatio = calculateCompressionRatio(
    result.original_size,
    result.converted_size
  );

  const handleCopyFilename = () => {
    navigator.clipboard.writeText(result.filename);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg border-0">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={`http://localhost:8000${result.download_url}`}
              alt="Converted JPG"
              className="w-full h-auto rounded-t-xl object-cover"
              style={{ maxHeight: "300px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium truncate text-lg">
                  {result.filename}
                </h3>
                <button
                  onClick={handleCopyFilename}
                  className="text-white hover:text-primary-200 transition-colors"
                  title="Copy filename"
                >
                  {copied ? (
                    <HiOutlineCheck className="w-5 h-5" />
                  ) : (
                    <HiOutlineDocumentDuplicate className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-white/80 text-sm">
                  {formatFileSize(result.converted_size)}
                </span>
                <span className="mx-2 text-white/50">•</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    compressionRatio > 0
                      ? "bg-green-500/90 text-white"
                      : "bg-yellow-500/90 text-white"
                  }`}
                >
                  {compressionRatio > 0 ? (
                    <>
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      {compressionRatio}% smaller
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        />
                      </svg>
                      {Math.abs(compressionRatio)}% larger
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex flex-col space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm border border-gray-100"
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mb-2 text-primary-600"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlinePhotograph className="w-5 h-5" />
                  </motion.div>
                  <span className="text-xs text-gray-500 font-medium">
                    Original
                  </span>
                  <span className="font-semibold text-sm text-gray-800">
                    {formatFileSize(result.original_size)}
                  </span>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm border border-gray-100"
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2 text-green-600"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlinePhotograph className="w-5 h-5" />
                  </motion.div>
                  <span className="text-xs text-gray-500 font-medium">
                    Converted
                  </span>
                  <span className="font-semibold text-sm text-gray-800">
                    {formatFileSize(result.converted_size)}
                  </span>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm border border-gray-100"
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2 text-blue-600"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlineClock className="w-5 h-5" />
                  </motion.div>
                  <span className="text-xs text-gray-500 font-medium">
                    Time
                  </span>
                  <span className="font-semibold text-sm text-gray-800">
                    {formatTime(result.conversion_time)}
                  </span>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center w-full text-gray-700 mt-2 border-dashed"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <HiOutlineInformationCircle className="w-4 h-4 mr-1.5" />
                  {showDetails
                    ? "Hide technical details"
                    : "Show technical details"}
                  <motion.span
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-1.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.span>
                </Button>
              </motion.div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl text-sm border border-gray-200 shadow-inner">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <HiOutlineInformationCircle className="w-5 h-5 mr-2 text-primary-500" />
                        Technical Details
                      </h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div className="text-gray-600 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          File format:
                        </div>
                        <div className="text-right font-medium text-gray-800 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                          JPEG
                        </div>

                        <div className="text-gray-600 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Original format:
                        </div>
                        <div className="text-right font-medium text-gray-800 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                          HEIC/HEIF
                        </div>

                        <div className="text-gray-600 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                          Compression ratio:
                        </div>
                        <div className="text-right font-medium bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                          {compressionRatio > 0 ? (
                            <span className="text-green-600 flex items-center justify-end">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                              </svg>
                              {compressionRatio}% reduction
                            </span>
                          ) : (
                            <span className="text-yellow-600 flex items-center justify-end">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                />
                              </svg>
                              {Math.abs(compressionRatio)}% increase
                            </span>
                          )}
                        </div>

                        <div className="text-gray-600 flex items-center">
                          <HiOutlineClock className="w-4 h-4 mr-2 text-primary-500" />
                          Processing time:
                        </div>
                        <div className="text-right font-medium text-gray-800 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                          {formatTime(result.conversion_time)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center p-5 bg-gradient-to-r from-gray-50 to-gray-100">
          <Button
            className="w-full flex items-center justify-center text-base py-3"
            variant="success"
            size="lg"
            onClick={() => onDownload(result.download_url, result.filename)}
          >
            <HiOutlineDownload className="w-6 h-6 mr-2" />
            Download JPG
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConversionResult;
