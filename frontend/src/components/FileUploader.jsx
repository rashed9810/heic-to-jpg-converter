import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineExclamation,
  HiOutlinePhotograph,
  HiOutlineCloudUpload,
  HiOutlineDocumentAdd,
} from "react-icons/hi";
import { isHeicFile } from "../utils/fileUtils";
import { cn } from "../utils/cn";

const FileUploader = ({ onFileSelect, className }) => {
  const [error, setError] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Reset error
      setError(null);

      // Get the first file
      const file = acceptedFiles[0];

      if (!file) return;

      // Check if it's a HEIC/HEIF file
      if (!isHeicFile(file)) {
        setError("Please select a HEIC or HEIF file");
        return;
      }

      // Pass the file to the parent component
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/heic": [".heic", ".heif"],
        "application/octet-stream": [".heic", ".heif"],
      },
      maxFiles: 1,
      multiple: false,
    });

  // Animation variants
  const containerVariants = {
    rest: {
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      y: 0,
    },
    hover: {
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      y: -5,
    },
    tap: {
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      y: 0,
      scale: 0.98,
    },
    dragActive: {
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      y: -10,
      scale: 1.02,
    },
  };

  const iconVariants = {
    rest: { scale: 1, rotate: 0, y: 0 },
    hover: { scale: 1.1, y: -5 },
    dragActive: { scale: 1.3, rotate: 360, y: -10 },
    tap: { scale: 0.9 },
  };

  const fileTypeVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.1,
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  return (
    <div className={className}>
      <motion.div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center w-full h-72 px-4 py-6 border-2 border-dashed rounded-xl",
          isDragActive
            ? "border-primary-400 bg-gradient-to-b from-primary-50 to-white"
            : "border-gray-300 bg-gray-50",
          isDragReject && "border-red-400 bg-red-50",
          "hover:border-primary-300 cursor-pointer"
        )}
        variants={containerVariants}
        initial="rest"
        whileHover={isDragActive ? "dragActive" : "hover"}
        whileTap="tap"
        animate={isDragActive ? "dragActive" : "rest"}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        <input {...getInputProps()} />

        <AnimatePresence>
          <motion.div
            className={cn(
              "flex items-center justify-center w-24 h-24 mb-5 rounded-full",
              isDragActive
                ? "bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-xl"
                : isHovering
                ? "bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 shadow-md"
                : "bg-gray-100 text-gray-500"
            )}
            variants={iconVariants}
            initial="rest"
            animate={
              isDragActive ? "dragActive" : isHovering ? "hover" : "rest"
            }
            whileHover="hover"
            whileTap="tap"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isDragActive ? (
              <HiOutlineCloudUpload className="w-12 h-12" />
            ) : (
              <HiOutlineDocumentAdd className="w-12 h-12" />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="text-center">
          {isDragActive ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <p className="text-2xl font-medium text-primary-600">
                Drop your HEIC file here
              </p>
              <p className="mt-2 text-sm text-primary-500 font-medium">
                Release to upload
              </p>
            </motion.div>
          ) : (
            <>
              <p className="text-xl font-medium text-gray-700">
                Drag & drop your HEIC file here
              </p>
              <p className="mt-2 text-sm text-gray-500">
                or click to browse files
              </p>
              <motion.div
                className="mt-5 flex flex-wrap justify-center gap-3"
                initial="rest"
                whileHover="hover"
              >
                <motion.span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm"
                  variants={fileTypeVariants}
                  whileHover="hover"
                >
                  <HiOutlinePhotograph className="w-3.5 h-3.5 mr-1" />
                  .heic
                </motion.span>
                <motion.span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm"
                  variants={fileTypeVariants}
                  whileHover="hover"
                >
                  <HiOutlinePhotograph className="w-3.5 h-3.5 mr-1" />
                  .heif
                </motion.span>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="flex items-center mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          <HiOutlineExclamation className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default FileUploader;
