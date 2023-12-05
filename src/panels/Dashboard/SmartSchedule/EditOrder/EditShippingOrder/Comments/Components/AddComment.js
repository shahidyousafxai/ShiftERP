import React, { useMemo } from "react";
import RichTextCommentInput from "./RichTextCommentInput";
import { Button } from "../../../../../../../shared";

const AddComment = ({
  value,
  placeholder,
  isReply,
  file,
  setFile,
  onChange,
  onPressAddNewComment,
  onPressCancelNewComment,
  tagList,
  buttonLoading,
  errorName,
  setErrorName,
  fileSizeError,
  setFileSizeError,
}) => {
  const mentions = useMemo(
    () => ({
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      source: (searchTerm, renderList, mentionChar) => {
        const list = mentionChar === "@" && tagList;
        const includesSearchTerm = list?.filter((item) =>
          item?.value?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
        renderList(includesSearchTerm);
      },
    }),
    []
  );

  return (
    <div className="">
      <RichTextCommentInput
        placeholder={placeholder}
        value={value}
        mentions={mentions}
        file={file}
        setFile={setFile}
        onChange={onChange}
        errorName={errorName}
        setErrorName={setErrorName}
        isReply={isReply}
        fileSizeError={fileSizeError}
        setFileSizeError={setFileSizeError}
      />

      {errorName && (
        <div className="text-danger text-sm ml-1 mt-1">{errorName}</div>
      )}

      <div
        className={`flex ${
          isReply ? "justify-start ml-1" : "justify-end"
        } items-center mt-1`}>
        <Button
          size="medium"
          className="capitalize mr-[10px] w-[80px]"
          component="span"
          color="primary"
          variant="contained"
          loading={buttonLoading}
          disabled={buttonLoading}
          onClick={onPressAddNewComment}>
          {isReply ? "Reply" : "Add"}
        </Button>
        <Button
          size="medium"
          className="capitalize mr-[10px] w-[80px]"
          component="span"
          variant="outlined"
          color="secondary"
          disabled={buttonLoading}
          onClick={onPressCancelNewComment}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddComment;
