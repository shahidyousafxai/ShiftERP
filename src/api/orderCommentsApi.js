import axios from "../helpers/axios";

export const getCommentTagList = (paylaod) =>
  axios.post(`tenant/api/order/get-taggable-user-listing`, paylaod);

export const getCommentList = (payload) =>
  axios.post(`tenant/api/order/get-comments`, payload);

export const addComment = (payload) => {
  axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
  return axios.post(`tenant/api/order/add-new-comment`, payload);
};
