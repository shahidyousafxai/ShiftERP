// Library Imports
import React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const BreadCrumb = (props) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center m-0 p-0">
        {props?.routes.map((route, index) => {
          return (
            <li key={index}>
              <div className="flex items-center">
                {route.color ? (
                  <a
                    className={`text-xs text-primaryColor`}
                    href={route.route}>
                    {route.name}
                  </a>
                ) : (
                  <p className={`text-xs text-secondaryTextColor`}>
                    {/* <p className={`text-xs text-secondaryTextColor`}> */}
                    {route.name}
                  </p>
                )}
                {props.routes.length > 1 &&
                  index !== props.routes.length - 1 && (
                  <ArrowRightIcon className="text-secondaryTextColor" />
                  )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
