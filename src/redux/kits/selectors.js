import { useSelector } from 'react-redux';

export const GetKits = () => {
  return useSelector((state) => state.kit.kits);
}

export const GetKitsLoading = () => {
  return useSelector((state) => state.kit.getKitsLoading);
}