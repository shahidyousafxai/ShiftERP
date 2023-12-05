import React, { useState } from "react";
import parse from "html-react-parser";
import AddComment from "../Components/AddComment";
import GroupComments from "../Components/GroupComments";
import { addComment } from "../../../../../../../api/orderCommentsApi";

const PublicComment = ({
  orderDetailsData,
  publicTagList,
  publicCommentListingArray,
  publicCommentListFunction,
}) => {
  //States
  const [addPublicCommentData, setAddPublicCommentData] = useState({
    body: "",
  });
  const [file, setFile] = useState(null);

  const [ButtonLoading, setButtonLoading] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);

  //tagList Array Starts
  const dataIndexValues = addPublicCommentData?.body
    ?.match(/data-index="(\d+)"/g)
    ?.map((match) => match.match(/\d+/)[0]);
  console.log("dataIndexValues:", dataIndexValues);

  const publicTagListArray = dataIndexValues?.map((item) => {
    return publicTagList[parseInt(item)].uuid;
  });
  //tagList Array End

  //handle Add New Comment
  const handleAddNewComment = () => {
    if (
      addPublicCommentData?.body?.replaceAll(/<[^>]*>/g, "") !== "" ||
      publicTagListArray !== undefined
    ) {
      setButtonLoading(true);

      const formData = new FormData();
      file !== null && formData.append("image", file !== null && file);
      formData.append("chat_id", orderDetailsData?.public_channel_id);
      formData.append("message", addPublicCommentData?.body);
      formData.append(
        "tags[]",
        publicTagListArray !== undefined && publicTagListArray
          ? JSON.stringify(publicTagListArray)
          : 0
      );

      addComment(formData)
        .then((res) => {
          // console.log("🚀 ~ Add comment response:", res?.data);
          setButtonLoading(false);
          setFileSizeError(false);
          setAddPublicCommentData({
            body: "",
          });
          setFile(null);
          setErrorName("");
          publicCommentListFunction();
        })
        .catch((error) => {
          console.log(error?.response);
          setButtonLoading(false);
        });
    } else {
      setErrorName("Please add comment or tag");
    }
  };

  const handleCancelNewComment = () => {
    setAddPublicCommentData({
      body: "",
    });
    setFile(null);
    setErrorName("");
    setFileSizeError(false);
  };

  return (
    <div>
      <div className="sticky top-[48px] z-50 bg-white">
        <AddComment
          isReply={false}
          value={addPublicCommentData?.body}
          placeholder={"Add a comment. Use @ to mention."}
          file={file}
          setFile={setFile}
          onChange={(value) => {
            setAddPublicCommentData({
              ...addPublicCommentData,
              body: value,
            });
            setErrorName("");
          }}
          tagList={publicTagList?.map((item, index) => ({
            id: index,
            value: item?.name,
          }))}
          onPressAddNewComment={handleAddNewComment}
          onPressCancelNewComment={handleCancelNewComment}
          buttonLoading={ButtonLoading}
          errorName={errorName}
          setErrorName={setErrorName}
          fileSizeError={fileSizeError}
          setFileSizeError={setFileSizeError}
        />
      </div>

      {/* Team Comments Listing call*/}
      {publicCommentListingArray?.map((comment, index) => {
        const lastIndex = publicCommentListingArray?.length - 1;

        return (
          <div className="flex flex-col mt-2">
            <GroupComments
              key={comment?.id}
              avatarURL={comment?.avatarURL}
              avatarName={comment?.avatarName}
              comment={parse(comment?.comment)}
              meta={comment?.meta}
              uuid={comment?.uuid}
              completeItem={comment?.completeItem}
              replies={comment?.replies}
              showLine={index !== lastIndex ? true : false}
              tagList={publicTagList}
              chatId={orderDetailsData?.public_channel_id}
              listFunction={publicCommentListFunction}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PublicComment;
