import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Features from "./components/Features";
import FileUploader from "./components/FileUploader";
import ConversionOptions from "./components/ConversionOptions";
import ConversionResult from "./components/ConversionResult";
import Button from "./components/ui/Button";
import Spinner from "./components/ui/Spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/Card";

// Utils
import { convertImage, downloadImage } from "./utils/api";

// Icons
import {
  HiOutlinePhotograph,
  HiOutlineX,
  HiOutlineArrowRight,
} from "react-icons/hi";

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({});

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setConversionResult(null);
  };

  const handleOptionsChange = (options) => {
    setConversionOptions(options);
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsLoading(true);

    try {
      // Filter out empty values from options
      const filteredOptions = Object.entries(conversionOptions).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      // Convert the image
      const result = await convertImage(file, filteredOptions);
      setConversionResult(result);
      toast.success("Image converted successfully!");
    } catch (err) {
      toast.error(err.message || "An error occurred during conversion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (url, filename) => {
    downloadImage(url, filename);
    toast.info("Downloading image...");
  };

  const handleReset = () => {
    setFile(null);
    setConversionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-12 overflow-hidden shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-md">
                  <HiOutlinePhotograph className="w-5 h-5" />
                </div>
                <CardTitle>Convert HEIC to JPG</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Upload your HEIC/HEIF image and convert it to JPG format with
                advanced options.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {!file ? (
                    <FileUploader onFileSelect={handleFileSelect} />
                  ) : (
                    <div className="space-y-5">
                      <motion.div
                        className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-md">
                            <HiOutlinePhotograph className="w-7 h-7" />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <span>{(file.size / 1024).toFixed(2)} KB</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-primary-600 font-medium">
                                HEIC/HEIF
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={handleReset}
                            className="ml-4 bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                            aria-label="Remove file"
                          >
                            <HiOutlineX className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>

                      <ConversionOptions
                        onChange={handleOptionsChange}
                        className="mb-5"
                      />

                      <Button
                        onClick={handleConvert}
                        disabled={isLoading}
                        className="w-full py-3 text-base shadow-md hover:shadow-lg transition-shadow"
                      >
                        {isLoading ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Converting...
                          </>
                        ) : (
                          <>
                            <HiOutlineArrowRight className="w-5 h-5 mr-2" />
                            Convert to JPG
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  {conversionResult ? (
                    <ConversionResult
                      result={conversionResult}
                      onDownload={handleDownload}
                    />
                  ) : (
                    <motion.div
                      className="h-full flex items-center justify-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                          <svg
                            className="h-10 w-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No converted image yet
                        </h3>
                        <p className="text-gray-500">
                          Upload a HEIC file and convert it to see the result
                          here. Your converted JPG will appear in this panel.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Features />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
