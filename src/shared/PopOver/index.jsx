import React, { useEffect, useRef } from "react";
import Whisper from "rsuite/Whisper";
import Button from "rsuite/Button";
import { primaryColor } from "../../helpers/GlobalVariables";

const CustomPopoverButton = ({
  classes,
  children,
  icon,
  color,
  placement,
  speaker,
  startIcon,
  text,
  active,
}) => {
  const triggerRef = useRef(null);
  const handleCloseWhisper = () => {
    if (triggerRef.current && triggerRef.current.close) {
      triggerRef.current.close();
    }
  };

  //
  const handleScroll = (event) => {
    if (event.deltaX !== 0 || event.deltaY !== 0) {
      if (triggerRef.current && triggerRef.current.close) {
        triggerRef.current.close();
      }
      // console.log("Prevented horizontal scroll");
    }
  };

  useEffect(() => {
    icon && window.addEventListener("scroll", handleCloseWhisper);
    return () => {
      icon && window.removeEventListener("scroll", handleCloseWhisper);
    };
  }, []);

  useEffect(() => {
    icon && window.addEventListener("wheel", handleScroll, { passive: true });

    return () => {
      icon && window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <Whisper
      placement={placement}
      trigger="click"
      ref={triggerRef}
      controlId={`control-id-${placement}`}
      speaker={speaker}>
      {icon ? (
        <Button className={`!m-0 !p-0 bg-white ml-[14px] ${classes}`}>
          {children}
        </Button>
      ) : (
        <Button
          appearance="default"
          className={`border rounded !ml-[15px] !h-[40px] bg-white text-[${
            active && primaryColor
          }]`}
          // style={{
          //   background: color,
          // }}
        >
          {startIcon}
          {text}
        </Button>
      )}
    </Whisper>
  );
};
export default CustomPopoverButton;
