import { useState } from "react";
import { getAllDependency } from "../../api/allDependencies";

function useAllDependencies() {
  const [dependences, setDependences] = useState(null);
  const [error, setError] = useState(null);
  const [loadingDepend, setLoadingDepend] = useState(false);

  async function allDependences(payload) {
    setLoadingDepend(true);
    try {
      const response = await getAllDependency(payload);
      const result = await response?.data?.data;
      setDependences(result);
      if (result) {
        setLoadingDepend(false);
      }
    } catch (error) {
      setError(error?.response);
      setLoadingDepend(false);
    } finally {
      setLoadingDepend(false);
    }
  }

  return { dependences, allDependences, error, loadingDepend };
}
export default useAllDependencies;
