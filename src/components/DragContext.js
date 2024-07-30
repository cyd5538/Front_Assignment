import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useDrag from "../hook/useDrag";

const DragContext = ({ state, setState }) => {
  const [dragState, setDragState] = useState({ isInvalid: false, column: null });
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelection = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
      }
    };

  const checkMove = (source, destination) => {
    // column-1에서 column-3 이동일때
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

  // 드래그 종료시 실행
  const onDragEnd = (result) => {
    handleDragEnd(result); // 훅 호출
    setDragState({ isInvalid: false, column: null }); // 초기화
    setSelectedItems([]);  // 초기화
  };

  // 드래그 영역 이동시 실행
  const onDragUpdate = (update) => {
    // 목적지 없으면 drgastate 상태 초기화
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
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          return (
            <div key={column.id} className="flex-1">
              <h2 className="font-bold mb-2">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-2 min-h-[200px] rounded-md ${
                      dragState.isInvalid && dragState.column === column.id
                        ? "bg-red-500"
                        : snapshot.isDraggingOver
                        ? "bg-sky-300"
                        : "bg-sky-500"
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => toggleSelection(item)}
                            className={`p-4 mb-2 rounded-md cursor-pointer ${
                              selectedItems.includes(item)
                                ? "bg-yellow-300 text-black"
                                : snapshot.isDragging
                                ? "bg-sky-500 text-white"
                                : "bg-white"
                            }`}
                          >
                            {item}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default DragContext;
