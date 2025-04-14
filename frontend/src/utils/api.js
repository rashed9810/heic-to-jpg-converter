import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:8000';
const API_V1 = '/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * Convert HEIC/HEIF image to JPG
 * @param {File} file - The HEIC/HEIF file to convert
 * @param {Object} options - Conversion options
 * @returns {Promise} - Promise with conversion result
 */
export const convertImage = async (file, options = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add conversion options
  if (options.quality) {
    formData.append('quality', options.quality);
  }
  
  if (options.resize) {
    formData.append('resize', options.resize);
  }
  
  if (options.width) {
    formData.append('width', options.width);
  }
  
  if (options.height) {
    formData.append('height', options.height);
  }
  
  if (options.maintain_aspect_ratio !== undefined) {
    formData.append('maintain_aspect_ratio', options.maintain_aspect_ratio);
  }
  
  if (options.rotate) {
    formData.append('rotate', options.rotate);
  }
  
  try {
    const response = await api.post(`${API_V1}/convert`, formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.detail || 'Error converting image');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up request: ' + error.message);
    }
  }
};

/**
 * Download a converted image
 * @param {string} url - The download URL
 * @param {string} filename - The filename to save as
 */
export const downloadImage = (url, filename) => {
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = `${API_BASE_URL}${url}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default api;
