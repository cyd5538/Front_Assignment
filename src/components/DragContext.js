import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DragContext = ({ state, setState }) => {
  const onDragEnd = (result) => {
    // source 이동할 아이템 destination 도착할 칼럼
    const { source, destination } = result;

    if (!destination) return;

    // 칼럼 내에서 이동할때
    if (source.droppableId === destination.droppableId) {
      const column = state.columns[source.droppableId];
      const newItems = Array.from(column.items);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [source.droppableId]: {
            ...column,
            items: newItems,
          },
        },
      };

      setState(newState);
      // 다른 칼럼으로 이동할 때
    } else {
      const sourceColumn = state.columns[source.droppableId];
      const destColumn = state.columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [removedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removedItem);

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        },
      };

      setState(newState);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                      snapshot.isDraggingOver ? "bg-sky-300" : "bg-sky-500"
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 mb-2 ${
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
