// FloatingButton.js
import React from "react";
import uploadIcon from "../../assets/icons/upload.svg";
const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 p-2 right-12 w-12 h-12 rounded-full bg-white text-white shadow-lg flex items-center justify-center hover:bg-gray-200 transition duration-300 z-[1000]"
      aria-label="Add"
    >
      <img src={uploadIcon} alt="" />
    </button>
  );
};

export default FloatingButton;
