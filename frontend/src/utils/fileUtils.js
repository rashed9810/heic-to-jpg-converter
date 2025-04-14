/**
 * Check if a file is a HEIC/HEIF image
 * @param {File} file - The file to check
 * @returns {boolean} - True if the file is a HEIC/HEIF image
 */
export const isHeicFile = (file) => {
  if (!file) return false;
  
  const fileName = file.name.toLowerCase();
  return fileName.endsWith('.heic') || fileName.endsWith('.heif');
};

/**
 * Calculate compression ratio between original and converted file
 * @param {number} originalSize - Original file size in bytes
 * @param {number} convertedSize - Converted file size in bytes
 * @returns {number} - Compression ratio as a percentage
 */
export const calculateCompressionRatio = (originalSize, convertedSize) => {
  if (originalSize === 0) return 0;
  
  const ratio = (1 - (convertedSize / originalSize)) * 100;
  return Math.round(ratio);
};

/**
 * Format time in seconds to a human-readable format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time
 */
export const formatTime = (seconds) => {
  if (seconds < 0.01) {
    return `${Math.round(seconds * 1000)} ms`;
  } else if (seconds < 1) {
    return `${(seconds * 1000).toFixed(0)} ms`;
  } else {
    return `${seconds.toFixed(2)} s`;
  }
};

/**
 * Generate a random ID
 * @returns {string} - Random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};
