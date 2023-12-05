import React, { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import OutlinedFlagOutlinedIcon from "@mui/icons-material/OutlinedFlagOutlined";
import TeamComment from "./TeamComments/TeamComment";
import PublicComment from "./PublicComments/PublicComments";
import { Typography } from "../../../../../../shared";
import { getCommentList } from "../../../../../../api/orderCommentsApi";

const Comments = ({ orderDetailsData, teamTagList, publicTagList }) => {
  const [selectCommentType, setSelectCommentType] = useState(false);
  const [publicCommentListingArray, setPublicCommentListingArray] = useState(
    []
  );
  const [teamCommentListingArray, setTeamCommentListingArray] = useState([]);

  const publicCommentListFunction = async () => {
    getCommentList({
      chat_id: orderDetailsData?.public_channel_id,
    })
      .then((res) => {
        if (res?.data?.data) {
          let data = res?.data?.data.map((item, index) => {
            let newObject = {
              id: index + 1,
              uuid: item?.uuid,
              avatarName: item?.owner?.full_name,
              avatarURL: item?.owner.profile_pic,
              comment: item?.message,
              meta: item?.created_at,
              replies: item?.replies,
              completeItem: item,
            };
            return newObject;
          });
          setPublicCommentListingArray(data);
        }
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: index.js ~ line 138 ~ getCommentList ~ error",
          error
        );
      });
  };

  const teamCommentListFunction = async () => {
    getCommentList({
      chat_id: orderDetailsData?.team_channel_id,
    })
      .then((res) => {
        if (res?.data?.data) {
          let data = res?.data?.data.map((item, index) => {
            let newObject = {
              id: index + 1,
              uuid: item?.uuid,
              avatarName: item?.owner?.full_name,
              avatarURL: item?.owner?.profile_pic,
              comment: item?.message,
              meta: item?.created_at,
              replies: item?.replies,
              completeItem: item,
            };
            return newObject;
          });
          setTeamCommentListingArray(data);
        }
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: index.js ~ line 138 ~ getCommentList ~ error",
          error
        );
      });
  };

  useEffect(() => {
    publicCommentListFunction();
    teamCommentListFunction();
  }, []);

  // useEffect(() => {
  //   if (selectCommentType) {
  //     getCommentList({
  //       chat_id: orderDetailsData?.public_channel_id,
  //     })
  //       .then((res) => {
  //         if (res?.data?.data) {
  //           let data = res?.data?.data.map((item, index) => {
  //             let newObject = {
  //               id: index + 1,
  //               uuid: item?.uuid,
  //               avatarName: item?.owner?.full_name,
  //               avatarUrl: item?.owner?.profile_pic,
  //               comment: item?.message,
  //               meta: item?.created_at,
  //               completeItem: item,
  //             };
  //             return newObject;
  //           });
  //           setPublicCommentListing(data);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(
  //           "🚀 ~ file: index.js ~ line 138 ~ getCommentList ~ error",
  //           error
  //         );
  //       });
  //   } else {
  //     getCommentList({
  //       chat_id: orderDetailsData?.team_channel_id,
  //     })
  //       .then((res) => {
  //         if (res?.data?.data) {
  //           let data = res?.data?.data.map((item, index) => {
  //             let newObject = {
  //               id: index + 1,
  //               uuid: item?.uuid,
  //               avatarName: item?.owner?.full_name,
  //               avatarUrl: item?.owner?.profile_pic,
  //               comment: item?.message,
  //               meta: item?.created_at,
  //               completeItem: item,
  //             };
  //             return newObject;
  //           });
  //           setTeamCommentListing(data);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(
  //           "🚀 ~ file: index.js ~ line 138 ~ getCommentList ~ error",
  //           error
  //         );
  //       });
  //   }
  // }, [selectCommentType]);

  return (
    <div className="px-2">
      <div className=" flex border rounded-lg bg-white w-full h-[calc(100vh-80px)] mx-2 my-4 overflow-auto">
        {/* Comment Type*/}
        <div className=" border-r-2 border-gray-200 w-2/12 py-3 px-2 ">
          <Typography variant="h6" className="capitalize text-[15px] px-1 pb-2">
            Comments
          </Typography>

          <div className="flex flex-col gap-2">
            <div
              className={`flex justify-between items-center cursor-pointer ${
                selectCommentType ? "" : "bg-lightGray"
              } p-2 rounded-md`}
              onClick={() => setSelectCommentType(false)}>
              <div className="flex items-center gap-2">
                <LockOutlinedIcon color="danger" className="text-base" />
                <Typography
                  variant="body2"
                  className="text-[13px] text-black mt-[2px]">
                  Team
                </Typography>
              </div>
              {/* <Typography
                variant="body2"
                color={"white"}
                className="text-[12px] px-2 py-1 rounded-[4px] bg-primaryColor">
                3
              </Typography> */}
            </div>

            <div
              className={`flex justify-between items-center cursor-pointer ${
                selectCommentType ? "bg-lightGray" : ""
              } p-2 rounded-md`}
              onClick={() => setSelectCommentType(true)}>
              <div className="flex items-center gap-2">
                <OutlinedFlagOutlinedIcon
                  color="success"
                  className="text-base"
                />
                <Typography
                  variant="body2"
                  className="text-[13px] text-black mt-[2px]">
                  Public
                </Typography>
              </div>
              {/*               
              <Typography
                variant="body2"
                color={"white"}
                className="text-[12px] px-2 py-1 rounded-[4px] bg-primaryColor">
                3
              </Typography> */}
            </div>
          </div>
        </div>
        {/* Comments section */}
        <div className="flex flex-col border-gray-200 w-10/12  px-3 overflow-y-auto">
          <Typography
            variant="h6"
            className="capitalize text-[15px] h-[48px] py-3 sticky top-0 bg-white z-50">
            {selectCommentType ? "Public" : "Team"} Comments
          </Typography>

          {/* Add Comment */}
          {selectCommentType ? (
            <PublicComment
              orderDetailsData={orderDetailsData}
              publicTagList={publicTagList}
              publicCommentListingArray={publicCommentListingArray}
              publicCommentListFunction={publicCommentListFunction}
            />
          ) : (
            <TeamComment
              orderDetailsData={orderDetailsData}
              teamTagList={teamTagList}
              teamCommentListingArray={teamCommentListingArray}
              teamCommentListFunction={teamCommentListFunction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
