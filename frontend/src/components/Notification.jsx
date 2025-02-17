// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import { motion, AnimatePresence } from "framer-motion";

const Notification = ({ message, type, isVisible, onClose }) => {
  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}
        >
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-2 hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification; 