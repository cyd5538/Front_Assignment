import React, { useState } from "react";
import ReactDOM from "react-dom";
import { initialColumn } from "./constants/constants";
import { ColumnAdd, DragContext } from "./components";
import "./index.css";

function App() {
  const [state, setState] = useState(initialColumn);

  return (
    <div className="flex flex-col space-y-4 p-4 bg-zinc-100 min-h-screen">
      <ColumnAdd state={state} setState={setState} />
      <DragContext state={state} setState={setState} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
