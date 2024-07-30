import React from "react";
import { Droppable } from "react-beautiful-dnd";
import DragItem from "./DragItem";

const DragColumn = ({ column, dragState, selectedItems, toggleSelection }) => {
  
  return (
    <div className="flex-1">
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
              <DragItem
                key={item}
                item={item}
                index={index}
                isSelected={selectedItems.includes(item)}
                toggleSelection={toggleSelection}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DragColumn;
