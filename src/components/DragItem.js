import React from "react";
import { Draggable } from "react-beautiful-dnd";

const DragItem = ({ item, index, isSelected, toggleSelection }) => {
  return (
    <Draggable key={item} draggableId={item} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => toggleSelection(item)}
          className={`p-4 mb-2 rounded-md cursor-pointer ${
            isSelected
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
  );
};

export default DragItem;
