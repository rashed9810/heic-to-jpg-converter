import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedImage, setConvertedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is a HEIC/HEIF file
      if (
        !selectedFile.name.toLowerCase().endsWith(".heic") &&
        !selectedFile.name.toLowerCase().endsWith(".heif")
      ) {
        setError("Please select a HEIC or HEIF file");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setConvertedImage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/v1/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to convert image");
      }

      const result = await response.json();
      setConvertedImage(`http://localhost:8000${result.download_url}`);
    } catch (err) {
      setError(err.message || "An error occurred during conversion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          HEIC to JPG Converter
        </h1>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="file-upload"
          >
            Select HEIC Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 cursor-pointer rounded-lg">
              <div className="flex flex-col items-center justify-center pt-7">
                <svg
                  className="w-10 h-10 text-gray-400 group-hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                  {file ? file.name : "Drag and drop or click to select"}
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".heic,.heif"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {file && !convertedImage && (
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Converting..." : "Convert to JPG"}
          </button>
        )}

        {file && !convertedImage && !isLoading && (
          <button
            onClick={handleReset}
            className="w-full mt-2 py-2 px-4 rounded-lg text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
        )}

        {convertedImage && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Converted Image
            </h2>
            <div className="border rounded-lg overflow-hidden mb-4">
              <img
                src={convertedImage}
                alt="Converted JPG"
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <a
                href={convertedImage}
                download={
                  file
                    ? file.name.replace(/\.heic|\.heif/i, ".jpg")
                    : "converted.jpg"
                }
                className="block w-full text-center py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
              >
                Download JPG
              </a>
              <button
                onClick={handleReset}
                className="w-full py-2 px-4 rounded-lg text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300"
              >
                Convert Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
