import React, { useState } from "react";
import Icons from "./Icons";
import Button from "../controls/Button";
import CodeMirror from "./CodeMirror";

const CellControl = (props) => {
  return <div className={`CellControl ${props.className || ""}`}>
    <Button icon={Icons.ChevronRight} />
    <Button icon="#" />
  </div>;
};
const CellValue = (props) => {
  return <div className={`CellValue ${props.className || ""}`}>
  </div>;
};

const CellContent = (props) => {
  const type = "jsx";
  return <div className={`CellContent ${props.className || ""}`}>
    <CodeMirror
      value={props.content}
      options={{
        mode: type,
      }}
    />
  </div>;
};

const Cell = (props) => {
  const isExpanded = useState(false);
  return <div className={`Cell ${props.className || ""}`}>
    <div className="Cell-wrapper">
      <div className="Cell-control">
        <CellControl {...props} />
      </div>
      <div className="Cell-contents">
        <CellValue className="Cell-value" {...props} />
        {isExpanded ? <CellContent className="Cell-editor" {...props} /> : null}
      </div>
    </div>
    <Button className="Cell-adder" icon={Icons.Add} />
  </div>;
};

export default Cell;
