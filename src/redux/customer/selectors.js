import { useSelector } from 'react-redux';

export const GetFacilities = () => {
  return useSelector((state) => state.customer.customers);
}

export const GetCustomersLoading = () => {
  return useSelector((state) => state.customer.getCustomerLoading);
}