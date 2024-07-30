import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useDrag from "../hook/useDrag";

const DragContext = ({ state, setState }) => {
  const { onDragEnd } = useDrag(state, setState, () => false);

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
