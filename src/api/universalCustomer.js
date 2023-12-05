import axios from "../helpers/axios";

export const getUniversalCustomers = () =>
  axios.get(`tenant/api/universal/customers`);
