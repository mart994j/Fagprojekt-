import { useState } from 'react';

// Custom hook for managing Sudoku board and note mode
export const sudokuNotes = (initialBoardState) => {
  const [board, setBoard] = useState(initialBoardState);
  const [noteMode, setNoteMode] = useState(false);

  const toggleNoteMode = () => {
    setNoteMode(!noteMode);
  };

  const handleCellInput = (rowIndex, colIndex, value) => {
    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      const cell = { ...newBoard[rowIndex][colIndex] };

      if (noteMode) {
        // Logic for adding/removing notes
        const notes = new Set(cell.notes || []);
        if (notes.has(value)) {
          notes.delete(value);
        } else {
          notes.add(value);
        }
        cell.notes = Array.from(notes);
      } else {
        // Logic for setting the cell's value
        cell.value = value;
      }

      newBoard[rowIndex][colIndex] = cell;
      return newBoard;
    });
  };

  return { board, noteMode, toggleNoteMode, handleCellInput };
};
