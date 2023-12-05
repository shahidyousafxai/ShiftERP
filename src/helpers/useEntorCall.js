import { useEffect } from "react";

const useEnterCall = (fun, dependancy) => {
  useEffect(
    (fun, dependancy) => {
      const listener = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
          console.log("Enter key was pressed. Run your function.");
          event.preventDefault();
        }
      };
      document.addEventListener("keydown", listener);
      return () => {
        document.removeEventListener("keydown", listener);
      };
    },
    [dependancy]
  );
};
export default useEnterCall;
