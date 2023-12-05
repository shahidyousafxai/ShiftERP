import { useState } from "react";

const usePostRequest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const UsePost = async (callback, payload) => {
    setLoading(true);
    try {
      const response = await callback(payload);
      const result = await response?.data?.data;
      setData({
        status: true,
        data: result === null ? response : result,
      });
      if (result) {
        setLoading(false);
      }
    } catch (error) {
      setData({ status: false, data: error?.response });
      setError(error?.response);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, UsePost };
};
export default usePostRequest;
