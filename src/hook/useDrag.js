import { useCallback } from 'react';

const useDrag = (state, setState, canMove = () => true) => {
  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;

    if (!destination || !canMove(source, destination)) return;

    // 칼럼 내에서 이동할 때
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
    } else {
      // 다른 칼럼으로 이동할 때
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
  }, [state, setState, canMove]);

  return { onDragEnd };
};

export default useDrag;
