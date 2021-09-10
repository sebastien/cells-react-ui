import React, { useState } from "react";
import "./less/controls.less";
import "./less/components.less";
import Cell from "./jsx/components/Cell";

function App() {
  return <Cell content={["a = 10", "b='Hello, World!'"]} />;
}

export default App;
