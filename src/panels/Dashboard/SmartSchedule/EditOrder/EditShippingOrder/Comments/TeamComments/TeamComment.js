import React, { useState } from "react";
import parse from "html-react-parser";
import AddComment from "../Components/AddComment";
import GroupComments from "../Components/GroupComments";
import { addComment } from "../../../../../../../api/orderCommentsApi";

const TeamComment = ({
  orderDetailsData,
  teamTagList,
  teamCommentListFunction,
  teamCommentListingArray,
}) => {
  // States
  const [addTeamCommentData, setAddTeamCommentData] = useState({
    body: "",
  });

  const [file, setFile] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [ButtonLoading, setButtonLoading] = useState(false);
  const [errorName, setErrorName] = useState("");

  //tagList Array
  const dataIndexValues = addTeamCommentData?.body
    ?.match(/data-index="(\d+)"/g)
    ?.map((match) => match.match(/\d+/)[0]);

  const teamTagListArray = dataIndexValues?.map((item) => {
    return teamTagList[parseInt(item)].uuid;
  });

  //handle Add New Comment
  const handleAddNewComment = () => {
    if (
      addTeamCommentData?.body?.replaceAll(/<[^>]*>/g, "") !== "" ||
      teamTagListArray !== undefined
    ) {
      setButtonLoading(true);

      const formData = new FormData();
      file !== null && formData.append("image", file !== null && file);
      formData.append("chat_id", orderDetailsData?.team_channel_id);
      formData.append("message", addTeamCommentData?.body);
      formData.append(
        "tags[]",
        teamTagListArray !== undefined && teamTagListArray
          ? JSON.stringify(teamTagListArray)
          : 0
      );

      addComment(formData)
        .then((res) => {
          // console.log("🚀 ~ Add comment response:", res?.data);
          setButtonLoading(false);
          setFileSizeError(false);
          setAddTeamCommentData({
            body: "",
          });
          setFile(null);
          setErrorName("");
          teamCommentListFunction();
        })
        .catch((error) => {
          console.log(error?.response);
          setButtonLoading(false);
        });
    } else {
      setErrorName("Please add comment or tag");
    }
  };

  //handle Cancel New Comment
  const handleCancelNewComment = () => {
    console.log("addTeamCommentData", addTeamCommentData);
    setAddTeamCommentData({
      body: "",
    });
    setFile(null);
    setErrorName("");
    setFileSizeError(false);
  };

  return (
    <div>
      {/* Add Comment */}
      <div className=" sticky top-[48px] z-50 bg-white">
        <AddComment
          isReply={false}
          value={addTeamCommentData?.body}
          placeholder={"Add a comment. Use @ to mention."}
          file={file}
          setFile={setFile}
          onChange={(value) => {
            setAddTeamCommentData({
              ...addTeamCommentData,
              body: value,
            });
            setErrorName("");
          }}
          tagList={teamTagList?.map((item, index) => ({
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
      {teamCommentListingArray?.map((comment, index) => {
        const lastIndex = teamCommentListingArray?.length - 1;

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
              tagList={teamTagList}
              chatId={orderDetailsData?.team_channel_id}
              listFunction={teamCommentListFunction}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TeamComment;
