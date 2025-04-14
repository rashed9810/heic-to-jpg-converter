// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  HiOutlinePhotograph,
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlineSparkles,
} from "react-icons/hi";

const Header = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500 },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  return (
    <header className="py-12 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg mr-4"
            variants={iconVariants}
            whileHover="hover"
          >
            <HiOutlinePhotograph className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            className="text-5xl font-display font-bold text-gray-800"
            variants={itemVariants}
          >
            HEIC to JPG{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600">
              Converter
            </span>
          </motion.h1>
        </motion.div>

        <motion.p
          className="mt-5 text-center text-gray-600 max-w-2xl mx-auto text-lg font-medium"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          Convert your HEIC/HEIF images to JPG format quickly and easily with
          our free online converter.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center bg-white px-5 py-3 rounded-full shadow-md text-sm text-gray-700 border border-gray-100"
            variants={featureVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <HiOutlineArrowRight className="w-5 h-5 text-primary-500 mr-2" />
            <span className="font-medium">No installation required</span>
          </motion.div>
          <motion.div
            className="flex items-center bg-white px-5 py-3 rounded-full shadow-md text-sm text-gray-700 border border-gray-100"
            variants={featureVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <HiOutlineClock className="w-5 h-5 text-primary-500 mr-2" />
            <span className="font-medium">Convert in seconds</span>
          </motion.div>
          <motion.div
            className="flex items-center bg-white px-5 py-3 rounded-full shadow-md text-sm text-gray-700 border border-gray-100"
            variants={featureVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <HiOutlineLockClosed className="w-5 h-5 text-primary-500 mr-2" />
            <span className="font-medium">100% secure conversion</span>
          </motion.div>
          <motion.div
            className="flex items-center bg-white px-5 py-3 rounded-full shadow-md text-sm text-gray-700 border border-gray-100"
            variants={featureVariants}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <HiOutlineSparkles className="w-5 h-5 text-primary-500 mr-2" />
            <span className="font-medium">High quality output</span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
