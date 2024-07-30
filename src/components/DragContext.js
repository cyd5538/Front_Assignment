import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import useDrag from "../hook/useDrag";
import DragColumn from "./DragColumn";

const DragContext = ({ state, setState }) => {
  const [dragState, setDragState] = useState({ isInvalid: false, column: null });
  const [selectedItems, setSelectedItems] = useState([]);

  const checkMove = (source, destination) => {
    // 컬럼1에서 컬럼3 이동시 false
    if (source.droppableId === 'column-1' && destination.droppableId === 'column-3') {
      return false;
    }

    const sourceItems = selectedItems.length ? selectedItems : [state.columns[source.droppableId].items[source.index]];
    const destinationItem = state.columns[destination.droppableId].items[destination.index];

    const isSourceItemEven = sourceItems.every(item => parseInt(item.split(" ")[1]) % 2 === 0);
    const isDestinationItemEven = destinationItem && parseInt(destinationItem.split(" ")[1]) % 2 === 0;
    // 짝수 아이템은 다른 짝수 아이템 앞에만 이동 가능
    if (isSourceItemEven && isDestinationItemEven) {
      return destination.index >= source.index;
    }

    return true;
  };

  const { onDragEnd: handleDragEnd } = useDrag(state, setState, checkMove, selectedItems, setSelectedItems);
  // 드래그 종료 시 실행
  const onDragEnd = (result) => {
    handleDragEnd(result);
    setDragState({ isInvalid: false, column: null });
    setSelectedItems([]);
  };
  // 드래그 도중 영역에 들어올 떄 실행
  const onDragUpdate = (update) => {
    // 목적지가 없으면 dragState 상태 초기화
    if (!update.destination) {
      setDragState({ isInvalid: false, column: null });
      return;
    }

    const { source, destination } = update;
    const isInvalid = !checkMove(source, destination);
    setDragState({ isInvalid, column: destination.droppableId });
  };
  
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-2 gap-4">
        {state.columnOrder.map((columnId) => (
          <DragColumn
            key={columnId}
            column={state.columns[columnId]}
            dragState={dragState}
            selectedItems={selectedItems}
            toggleSelection={(item) => {
              setSelectedItems((prevSelectedItems) =>
                prevSelectedItems.includes(item)
                  ? prevSelectedItems.filter((i) => i !== item)
                  : [...prevSelectedItems, item]
              );
            }}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default DragContext;
