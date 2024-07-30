import { useCallback } from 'react';

const useDrag = (state, setState, canMove = () => true, selectedItems, setSelectedItems) => {
  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;

    // 이동할 수 없는 곳일 때
    if (!destination || !canMove(source, destination)) return;

    // 여러 아이템일 경우 순서유지
    const itemsToMove = selectedItems.length
      ? selectedItems.sort((a, b) => state.columns[source.droppableId].items.indexOf(a) - state.columns[source.droppableId].items.indexOf(b))
      : [state.columns[source.droppableId].items[source.index]];

    if (source.droppableId === destination.droppableId) {
      // 같은 컬럼 내에서 아이템 재정렬
      const column = state.columns[source.droppableId];
      const newItems = Array.from(column.items);

      // 선택된 아이템들을 새 위치로 이동
      itemsToMove.forEach(item => {
        const currentIndex = newItems.indexOf(item);
        if (currentIndex > -1) {
          newItems.splice(currentIndex, 1);
        }
      });
      newItems.splice(destination.index, 0, ...itemsToMove);

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
      // 다른 컬럼으로 이동할 때
      const sourceColumn = state.columns[source.droppableId];
      const destColumn = state.columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);

      // 선택된 아이템들 제거
      itemsToMove.forEach(item => {
        const currentIndex = sourceItems.indexOf(item);
        if (currentIndex > -1) {
          sourceItems.splice(currentIndex, 1);
        }
      });
      // 목적지에 아이템 추가
      destItems.splice(destination.index, 0, ...itemsToMove);

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
    setSelectedItems([]); 
  }, [state, setState, canMove, selectedItems, setSelectedItems]);

  return { onDragEnd };
};

export default useDrag;
