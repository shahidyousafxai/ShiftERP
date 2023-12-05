import React from "react";
import "./spinner.module.css";
export const SpinnerHOC =
  (WrappedComponent) =>
  ({ isLoading, ...otherProps }) =>
    isLoading ? (
      <div className="SpinnerOverlay">
        <div className="SpinnerContainer" />
      </div>
    ) : (
      <WrappedComponent {...otherProps}></WrappedComponent>
    );
export const Spinner = () => {
  return (
    <div className="border-gray-300 h-14 w-14 animate-spin rounded-full border-5 border-t-primaryColor border-b-primaryColor" />
  );
};
const InsideSpinner = () => {
  return (
    <div
      style={{ height: window.innerHeight * 0.6 }}
      className="m-auto flex justify-center items-center">
      <Spinner />
    </div>
  );
};
export default InsideSpinner;
