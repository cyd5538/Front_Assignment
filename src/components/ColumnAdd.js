import React from "react";

const ColumnAdd = ({ state, setState }) => {
  // column-1에 아이템추가
  const addItem = () => {
    const column1 = state.columns["column-1"];
    const items = column1.items;
    // 모든 칼럼의 아이템에서 제일 큰 숫자를 찾아 + 1한 새로운 아이템 추가
    const allItems = Object.values(state.columns).flatMap(column => column.items);
    const newItemNumber =
      allItems.length > 0
        ? Math.max(...allItems.map((item) => parseInt(item.split(" ")[1]))) + 1
        : 1;
    const newItem = `Item ${newItemNumber}`;

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        "column-1": {
          ...column1,
          items: [...items, newItem],
        },
      },
    };

    setState(newState);
  };

  return (
    <button
      onClick={addItem}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add Item to Column 1
    </button>
  );
};

export default ColumnAdd;
