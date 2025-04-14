import { motion } from "framer-motion";
import {
  HiOutlineLockClosed,
  HiOutlineGlobe,
  HiOutlineCog,
  HiOutlinePhotograph,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineDeviceMobile,
} from "react-icons/hi";

const features = [
  {
    icon: <HiOutlineLockClosed className="w-6 h-6" />,
    title: "Secure Conversion",
    description:
      "Your files are processed securely and never stored permanently on our servers.",
    color: "bg-blue-500",
  },
  {
    icon: <HiOutlineGlobe className="w-6 h-6" />,
    title: "Works Everywhere",
    description:
      "Convert HEIC images from any device - iPhone, iPad, Mac, or Windows PC.",
    color: "bg-purple-500",
  },
  {
    icon: <HiOutlineCog className="w-6 h-6" />,
    title: "Advanced Options",
    description:
      "Customize your conversion with quality settings, resizing, and rotation options.",
    color: "bg-indigo-500",
  },
  {
    icon: <HiOutlinePhotograph className="w-6 h-6" />,
    title: "High Quality",
    description:
      "Maintain the original quality of your images during conversion.",
    color: "bg-green-500",
  },
  {
    icon: <HiOutlineLightningBolt className="w-6 h-6" />,
    title: "Fast Processing",
    description:
      "Our optimized conversion engine processes your images in seconds.",
    color: "bg-yellow-500",
  },
  {
    icon: <HiOutlineDeviceMobile className="w-6 h-6" />,
    title: "Mobile Friendly",
    description:
      "Fully responsive design works perfectly on smartphones and tablets.",
    color: "bg-red-500",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose Our Converter?
          </h2>
          <p className="text-gray-600 text-lg">
            Our HEIC to JPG converter offers a excellent experience with
            powerful features designed to make your image conversion effortless.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center text-white mb-5 shadow-md`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 bg-primary-50 rounded-2xl p-8 border border-primary-100 max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <HiOutlineSparkles className="w-10 h-10" />
              </div>
            </div>
            <div className="md:w-3/4 md:pl-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Free and Easy to Use
              </h3>
              <p className="text-gray-600 mb-4">
                Our converter is completely free with no hidden fees or
                limitations. Simply drag and drop your HEIC files and convert
                them to JPG in seconds.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  No registration required
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  No watermarks
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  No file size limits
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
