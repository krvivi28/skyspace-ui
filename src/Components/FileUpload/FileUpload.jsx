import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import upload from "../../assets/icons/upload.svg";

const FileUpload = ({ onFileUpload }) => {
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result;
        onFileUpload(content, file.type);
      };
      reader.readAsText(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".geojson"],
      "application/vnd.google-earth.kml+xml": [".kml"],
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="flex py-4 absolute top-1 right-12 z-[1000] px-6 rounded-lg flex-col items-center gap-1 border border-[#EAECF0] bg-white"
      >
        <input {...getInputProps()} />
        <img src={upload} alt="" />
        <p className="text-sm text-[#475467]">
          Drag 'n' drop some files here, or{" "}
          <span className="font-semibold text-[#175CD3]">
            click to select files
          </span>{" "}
        </p>
        <p className="font-normal text-xs text-[#475467]">
          Only *.geojson and *.kml files will be accepted
        </p>
      </div>
    </>
  );
};

export default FileUpload;
