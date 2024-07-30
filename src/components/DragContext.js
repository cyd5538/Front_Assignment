import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useDrag from "../hook/useDrag";

const DragContext = ({ state, setState }) => {
  // isInvalid: 현재 드래그가 유효하지 않은지, column: 칼럼 위치
  const [dragState, setDragState] = useState({ isInvalid: false, column: null });

  const checkMove = (source, destination) => {
    // 첫 번째 칼럼에서 세 번째 칼럼으로의 이동만 막음
    if (source.droppableId === 'column-1' && destination.droppableId === 'column-3') {
      return false;
    }

    const sourceItem = state.columns[source.droppableId].items[source.index];
    const destinationItem = state.columns[destination.droppableId].items[destination.index];

    const isSourceItemEven = parseInt(sourceItem.split(" ")[1]) % 2 === 0;
    const isDestinationItemEven = destinationItem && parseInt(destinationItem.split(" ")[1]) % 2 === 0;

    if (isSourceItemEven && isDestinationItemEven) {
      return destination.index > source.index;
    }

    return true;
  };

  const { onDragEnd: handleDragEnd } = useDrag(state, setState, checkMove);

  // 드래그가 끝났을 때 실행
  const onDragEnd = (result) => {
    handleDragEnd(result); // useDrag hook 실행
    setDragState({ isInvalid: false, column: null }); // dragState 상태 초기화
  };

  // 드래그 중에 실행되는 함수
  const onDragUpdate = (update) => {
    if (!update.destination) {
      setDragState({ isInvalid: false, column: null });
      return;
    }

    const { source, destination } = update;
    const isInvalid = !checkMove(source, destination); // 이동이 유효한지 확인
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
                            className={`p-4 mb-2 rounded-md ${
                              snapshot.isDragging
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