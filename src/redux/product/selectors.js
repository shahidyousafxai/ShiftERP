import { useSelector } from 'react-redux';

export const GetProducts = () => {
  return useSelector((state) => state.product.products);
}

export const GetProductsLoading = () => {
  return useSelector((state) => state.product.getProductsLoading);
}