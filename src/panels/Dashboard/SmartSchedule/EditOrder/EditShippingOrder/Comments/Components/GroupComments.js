import React, { useState } from "react";
import parse from "html-react-parser";
import { IconButton } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Collapse from "@mui/material/Collapse";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AssetsImages from "../../../../../../../assets/images";
import { Typography } from "../../../../../../../shared";
import { addComment } from "../../../../../../../api/orderCommentsApi";
import AddComment from "./AddComment";

const GroupComments = ({
  avatarURL,
  avatarName,
  meta,
  comment,
  replies,
  showLine,
  completeItem,
  uuid,
  tagList,
  chatId,
  listFunction,
}) => {
  const [replyData, setReplyData] = useState({
    body: "",
  });
  const [isReply, setIsReply] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [file, setFile] = useState(null);
  const [ButtonLoading, setButtonLoading] = useState(false);
  const pic = AssetsImages.profileImg;
  const [nestedReply, setNestedReply] = useState(false);
  const [openCommentReply, setOpenCommentReply] = useState(false);
  const [matchUUID, setMatchUUID] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);

  // date Selection
  const dateSelection = (date) => {
    const inputDate = new Date(date);

    // Get the current date
    const today = new Date();
    const todayDateString = today?.toDateString();

    // Get the time part of the input date in the format "8:30pm"
    const formattedTime = inputDate?.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    let formattedDate;

    if (inputDate?.toDateString() === todayDateString) {
      // If the inputDate is today
      formattedDate = "Today, " + formattedTime;
    } else {
      // If the inputDate is not today
      formattedDate = inputDate?.toLocaleString("en-US", {
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }
    return formattedDate;
    // console.log(formattedDate);
  };

  const handleNestedReply = (uuid) => {
    setIsReply(false);
    setNestedReply(true);
    setMatchUUID(uuid);
    setErrorName("");
    setFileSizeError(false);
    setReplyData({
      body: "",
    });
  };

  //tagList Array
  const dataIndexValues = replyData?.body
    ?.match(/data-index="(\d+)"/g)
    ?.map((match) => match.match(/\d+/)[0]);

  const tagListArray = dataIndexValues?.map((item) => {
    return tagList[parseInt(item)].uuid;
  });

  const handleReplyComment = () => {
    if (
      replyData?.body?.replaceAll(/<[^>]*>/g, "") !== "" ||
      tagListArray !== undefined
    ) {
      setButtonLoading(true);

      const formData = new FormData();

      file !== null && formData.append("image", file !== null && file);
      formData.append("parent_id", uuid);
      formData.append("chat_id", chatId);
      formData.append("message", replyData?.body);
      formData.append(
        "tags[]",
        tagListArray !== undefined && tagListArray
          ? JSON.stringify(tagListArray)
          : 0
      );

      addComment(formData)
        .then((res) => {
          // console.log("🚀 ~ Add comment response:", res?.data);
          setButtonLoading(false);
          setFileSizeError(false);
          setIsReply(false);
          setReplyData({
            body: "",
          });
          setFile(null);
          setErrorName("");
          setNestedReply(false);
          listFunction();
        })
        .catch((error) => {
          console.log(error?.response);
          setButtonLoading(false);
        });
    } else {
      setErrorName("Please add comment or tag");
    }
  };

  const handleCancelReplyComment = () => {
    setButtonLoading(false);
    setIsReply(false);
    setNestedReply(false);
    setReplyData({
      body: "",
    });
    setFile(null);
    setErrorName("");
  };

  // const handleNestedReplyComment = (nestedUUID) => {
  //   // console.log(
  //   //   "🚀 ~ file: GroupComments.js:148 ~ handleNestedReplyComment ~ uuid:",
  //   //   uuid
  //   // );

  //   if (
  //     replyData?.body?.replaceAll(/<[^>]*>/g, "") !== "" ||
  //     tagListArray !== undefined
  //   ) {
  //     setButtonLoading(true);

  //     const formData = new FormData();

  //     file !== null && formData.append("image", file !== null && file);
  //     formData.append("parent_id", nestedUUID);
  //     formData.append("chat_id", chatId);
  //     formData.append("message", replyData?.body);
  //     formData.append(
  //       "tags[]",
  //       tagListArray !== undefined && tagListArray
  //         ? JSON.stringify(tagListArray)
  //         : 0
  //     );

  //     addComment(formData)
  //       .then((res) => {
  //         // console.log("🚀 ~ Add comment response:", res?.data);
  //         setButtonLoading(false);
  //         setReplyData({
  //           body: "",
  //         });
  //         setFile(null);
  //         setErrorName("");
  //         setIsReply(false);
  //         listFunction();
  //       })
  //       .catch((error) => {
  //         console.log(error?.response);
  //         setButtonLoading(false);
  //       });
  //   } else {
  //     setErrorName("Please add comment or tag");
  //   }
  // };

  // const handleCancelNestedReplyComment = () => {
  //   setButtonLoading(false);
  //   setIsReply(false);
  //   setNestedReply(false);
  //   setReplyData({
  //     body: "",
  //   });
  //   setFile(null);
  //   setErrorName("");
  // };

  return (
    <div className="flex justify-center mb-2">
      {/* image */}
      <div className="relative mt-2">
        <div className="relative ">
          <img
            src={avatarURL === null ? pic : avatarURL}
            className="w-[40px] h-[40px] border-r-[15px] rounded-full"
            alt="main-img"
          />
          {/* <div className="bg-blue-900 rounded-full w-[12px] h-[12px] absolute top-[0px] z-10"></div>
          <div className="bg-white w-[13px] h-[13px] absolute top-0 rounded-full z-0"></div> */}
        </div>
      </div>

      {showLine ? (
        <div className="flex border rounded-lg w-fit top-[48px] right-5 relative"></div>
      ) : null}

      {/* comment/thread listing */}
      <div className=" flex flex-col border rounded-lg bg-white w-full ml-4  ">
        {/* avatar name and meta */}
        <div className="flex justify-between items-center">
          <div>
            <Typography
              className={"capitalize"}
              variant="body1"
              fontSize={15}
              marginTop={2}
              marginLeft={2}
              fontWeight={600}>
              {avatarName}
            </Typography>
            <Typography
              variant="body1"
              fontSize={11}
              marginLeft={2}
              fontWeight={400}>
              {dateSelection(meta)}
            </Typography>
          </div>

          <div className="mx-6">
            <IconButton
              onClick={() => {
                setIsReply(true);
                setNestedReply(false);
                setErrorName("");
              }}>
              <ReplyIcon className="text-secondaryColor" />
            </IconButton>
          </div>
        </div>
        <Typography
          className={"comment-list mr-4 my-2"}
          variant="body1"
          fontSize={13}
          marginLeft={2}
          fontWeight={400}>
          {comment}
        </Typography>

        {/* Add File */}
        {completeItem?.file !== null && (
          <div className="pl-3 py-2">
            <a href={completeItem?.file} target="_blank">
              <InsertDriveFileIcon
                fontSize="small"
                className="text-secondaryColor text-[16px] mb-[2px]"
              />
              <span className="text-primaryColor text-[14px] px-1">
                {completeItem?.file_name && completeItem?.file_name !== null
                  ? `${completeItem?.file_name}.${completeItem?.file_extension}`
                  : "Sample.pdf"}{" "}
              </span>
            </a>
          </div>
        )}

        {isReply && (
          <div className="m-3">
            <AddComment
              isReply={true}
              value={replyData?.body}
              placeholder={"Add a comment. Use @ to mention."}
              file={file}
              setFile={setFile}
              onChange={(value) => {
                setReplyData({
                  ...replyData,
                  body: value,
                });

                setErrorName("");
              }}
              tagList={tagList?.map((item, index) => ({
                id: index,
                value: item?.name,
              }))}
              onPressAddNewComment={handleReplyComment}
              onPressCancelNewComment={handleCancelReplyComment}
              buttonLoading={ButtonLoading}
              errorName={errorName}
              setErrorName={setErrorName}
              fileSizeError={fileSizeError}
              setFileSizeError={setFileSizeError}
            />
          </div>
        )}
        {replies?.length > 0 && (
          <div className="flex flex-col justify-center h-8 bg-lightGray w-full mt-1">
            {openCommentReply ? (
              <div
                className="flex items-center ml-3 cursor-pointer"
                onClick={() => {
                  setOpenCommentReply(false);
                  setNestedReply(false);
                }}>
                <ArrowDropUpIcon className="text-secondaryColor" fontSize="small" />

                <Typography
                  variant="body1"
                  className={"ml-[3px]"}
                  fontSize={13}
                  fontWeight={500}>
                  Collapse replies
                </Typography>
              </div>
            ) : (
              <div
                className="flex items-center ml-3 cursor-pointer"
                onClick={() => setOpenCommentReply(true)}>
                <ArrowDropDownIcon
                    className="text-secondaryColor"
                  fontSize="small"
                />
                <Typography
                  variant="body1"
                  className={"mt-[1px] ml-[2px] "}
                  fontSize={13}
                  fontWeight={400}
                  color={"primary"}>
                  {replies?.length} replies
                </Typography>

                <AvatarGroup
                  max={4}
                  spacing={0}
                  className="ml-2"
                  sx={{
                    "& .MuiAvatar-root": {
                      width: "22px",
                      height: "22px",
                      fontSize: 12,
                      border: "none",
                    },
                  }}>
                  {replies?.map((reply, index) => {
                    return (
                      <Avatar
                        alt="Remy Sharp"
                        src={
                          reply?.owner.profile_pic === null
                            ? pic
                            : reply?.owner.profile_pic
                        }
                        className="h-[22px] w-[22px]"
                      />
                    );
                  })}
                </AvatarGroup>

                <Typography
                  variant="body1"
                    className={"ml-[2px] text-secondaryColor"}
                  fontSize={13}
                  fontWeight={400}>
                  Last reply by
                </Typography>

                <Typography
                  variant="body1"
                  className={"ml-[3px]"}
                  fontSize={13}
                  fontWeight={500}>
                  {replies[replies?.length - 1]?.owner?.full_name}
                </Typography>
              </div>
            )}
          </div>
        )}

        {/* Replies */}
        {replies?.length > 0 &&
          replies?.map((reply, index) => {
            return (
              <>
                <Collapse in={openCommentReply} timeout="auto" unmountOnExit>
                  <div className="flex my-2 ml-2 w-full pl-2 pr-4">
                    <Avatar
                      alt="Remy Sharp"
                      src={
                        reply?.owner.profile_pic === null
                          ? pic
                          : reply?.owner.profile_pic
                      }
                      className="mt-[12px] ml-1"
                    />
                    <div className=" flex flex-col w-full">
                      <div className="flex justify-between items-center">
                        <div>
                          <Typography
                            className={"capitalize"}
                            variant="body1"
                            fontSize={15}
                            marginTop={2}
                            marginLeft={2}
                            fontWeight={600}>
                            {reply?.owner?.full_name}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontSize={11}
                            marginLeft={2}
                            fontWeight={400}>
                            {dateSelection(reply?.created_at)}
                          </Typography>
                        </div>

                        <div className="mx-6">
                          <IconButton
                            onClick={() => handleNestedReply(reply?.uuid)}>
                            <ReplyIcon className="text-secondaryColor" />
                          </IconButton>
                        </div>
                      </div>

                      <Typography
                        className={"mr-4 comment-list"}
                        variant="body1"
                        fontSize={13}
                        marginLeft={2}
                        fontWeight={400}
                        marginTop={2}>
                        {parse(reply?.message)}
                      </Typography>

                      {/* Add File */}
                      {reply?.file !== null && (
                        <div className="pl-3 py-2">
                          <a href={reply?.file} target="_blank">
                            <InsertDriveFileIcon
                              fontSize="small"
                              className="text-secondaryColor text-[16px] mb-[2px]"
                            />

                            <span className="text-primaryColor text-[14px] px-1">
                              {reply?.file_name && reply?.file_name !== null
                                ? `${reply?.file_name}.${reply?.file_extension}`
                                : "Sample.pdf"}{" "}
                            </span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {nestedReply && matchUUID === reply?.uuid && (
                    <div className="m-3">
                      <AddComment
                        isReply={true}
                        value={replyData?.body}
                        placeholder={"Add a comment. Use @ to mention."}
                        file={file}
                        setFile={setFile}
                        onChange={(value) => {
                          setReplyData({
                            ...replyData,
                            body: value,
                          });

                          setErrorName("");
                        }}
                        tagList={tagList?.map((item, index) => ({
                          id: index,
                          value: item?.name,
                        }))}
                        onPressAddNewComment={handleReplyComment}
                        onPressCancelNewComment={handleCancelReplyComment}
                        // onPressAddNewComment={() =>
                        //   handleNestedReplyComment(reply?.uuid)
                        // }
                        // onPressCancelNewComment={handleCancelNestedReplyComment}
                        buttonLoading={ButtonLoading}
                        errorName={errorName}
                        setErrorName={setErrorName}
                        fileSizeError={fileSizeError}
                        setFileSizeError={setFileSizeError}
                      />
                    </div>
                  )}
                </Collapse>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default GroupComments;
