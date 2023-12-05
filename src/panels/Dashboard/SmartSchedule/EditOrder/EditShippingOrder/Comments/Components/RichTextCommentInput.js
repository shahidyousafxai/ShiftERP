import React, { useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import LinkIcon from "@mui/icons-material/Link";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClearIcon from "@mui/icons-material/Clear";
import "./commentRichTextStyles.css";

// Custom function to generate a random ID
const generateRandomId = () => {
  return `rte-${Math.random().toString(36).substring(7)}`;
};

function RichTextCommentInput({
  value,
  onChange,
  placeholder,
  mentions,
  file,
  setFile,
  errorName,
  setErrorName,
  isReply,
  fileSizeError,
  setFileSizeError,
}) {
  const [id] = useState(generateRandomId()); // Use the generated ID as state
  const [url, setURL] = useState("");
  // const [fileSizeError, setFileSizeError] = useState(false);

  // handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    let fileSize = (file?.size / (1024 * 1024)).toFixed(2);

    if (fileSize <= 2) {
      setFile(file);
      setURL(URL.createObjectURL(file));
    } else {
      setFileSizeError(true);
    }
  };

  // To Run OnChange Handler Again To Select Same Image
  const onInputClick = (event) => {
    event.target.value = "";
    setFileSizeError(false);
    setErrorName("");
  };

  return (
    <div
      className={`${
        file ? "h-[168px]" : "h-[120px] "
      } comment relative !border-[2.5px] !rounded-[8px] !border-solid ${
        errorName === "" ? "!border-lightGray" : "!border-danger"
      } z-40`}>
      <RichTextEditor
        className="w-full z-40 max-h-[108px] relative"
        id={id}
        sticky={true}
        value={value}
        mentions={mentions}
        placeholder={placeholder}
        onChange={onChange}
        controls={[["bold", "italic", "unorderedList", "orderedList"]]}
      />
      <label className="">
        <LinkIcon className="text-[#bcbec4] absolute z-40 top-[8px] left-[168px] cursor-pointer" />
        <input
          type="file"
          accept=".pdf"
          className="file-input-button"
          onChange={handleFileUpload}
          onClick={onInputClick}
        />
      </label>

      {file && (
        <div className="flex items-center justify-between py-2 pl-2 pr-4 ml-1 mb-[6px] absolute bottom-0 rounded-lg w-[99%] ">
          <div className="flex items-center gap-[6px]">
            <InsertDriveFileIcon fontSize="small" className="text-secondaryColor " />
            <span className="text-primaryColor mt-1">{file?.name}</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <a href={url} target="_blank">
              <VisibilityIcon className="text-secondaryColor cursor-pointer mt-1 text-base" />
            </a>
            <ClearIcon
              className="text-secondaryColor cursor-pointer mt-1 text-base"
              onClick={() => setFile(null)}
            />
          </div>
        </div>
      )}
      {fileSizeError && (
        <div
          className={`w-fit text-danger text-sm ${
            isReply ? "ml-[185px] -mt-4" : "ml-[2px] "
          }`}>
          File size must be smaller than 2 MB
        </div>
      )}
    </div>
  );
}

export default RichTextCommentInput;
