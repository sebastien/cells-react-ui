import React from "react";
export default function Button(props) {
  return <button
    className={`Button ${props.className || ""} ${
      props.icon ? "with-icon" : "no-icon"
    } ${props.children ? "with-content" : "no-content"}`}
    onClick={props.onClick}
  >
    {props.icon}
    {props.children}
  </button>;
}
