import axios from "../helpers/axios";

//LOGIN
export const getUsersForAdmin = (name, roleId, status, order) => {
  const formData = new FormData();
  formData.append("search", name);
  roleId.forEach((item) => formData.append("role_ids[]", item));
  formData.append("status", status);
  formData.append("order", order);
  return axios.post(`tenant/api/user/list`, formData);
};
export const getFacilitiesList = (name, status, order) => {
  const formData = new FormData();
  formData.append("search", name);
  formData.append("status", status);
  formData.append("order", order);
  return axios.post("tenant/api/facility/list", formData);
};
export const userDetails = (payload) =>
  axios.post(`tenant/api/user/show`, payload);
export const deleteUser = (id) => axios.get(`tenant/api/user/delete/${id}`);
export const deleteFacility = (id) =>
  axios.post(`tenant/api/facility/delete`, { uuid: id });
export const getAllRoles = (id) =>
  axios.get("tenant/api/all-roles-permissions");

export const getFacilityUsers = (id) =>
  axios.post(`tenant/api/facility/get-facility-users`, { facility_id: id });
export const updateUserFacilty = (payload) =>
  axios.post(`tenant/api/facility/add-facility-in-user`, payload);
export const addUsersInFacilities = (payload) =>
  axios.post(`tenant/api/facility/add-users-in-facilities`, payload);

export const getSearchedUser = (name, roleId, status, order) => {
  const formData = new FormData();
  formData.append("search", name);
  roleId.forEach((item) => formData.append("role_ids[]", item));
  status && formData.append("status", status);
  formData.append("order", order);
  return axios.post(`tenant/api/user/search`, formData);
};

export const getSearchedFacility = (name, primaryContact, status, order) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("primary_contact", name);
  formData.append("status", status);
  formData.append("order", order);
  return axios.post(`tenant/api/facility/search`, formData);
};

export const deteleMultipleUsers = (ids) => {
  return axios.post(`tenant/api/user/multi-delete`, { ids: ids });
};

export const updateFacilty = (
  uuid,
  name,
  office_phone,
  address,
  city,
  state,
  zip_code,
  primary_contact_email,
  primary_contact_name,
  status
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("office_phone", office_phone);
  formData.append("address", address);
  formData.append("city", city);
  formData.append("state", state);
  formData.append("zip_code", zip_code);
  formData.append("primary_contact_name", primary_contact_name);
  formData.append("primary_contact_email", primary_contact_email);
  formData.append("status", status);
  return axios.post(`tenant/api/facility/update/${uuid}`, formData);
};

export const facilityDetails = (payload) =>
  axios.post(`tenant/api/facility/get`, payload);

export const deleteFacilty = (uuid) => {
  return axios.get(`tenant/api/facility/delete/${uuid}`);
};

export const getUserFacilities = (uuid) => {
  return axios
    .post(`tenant/api/facility/get-user-facilities`, { user_id: uuid })
    .catch((error) => {
      if (error.response) {
        return { error: error.response.status };
      }
    });
};
