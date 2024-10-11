// Loader.js
import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 pointer-events-auto">
      <div className="w-10 h-10 border-4 border-t-transparent border-blue-800 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
