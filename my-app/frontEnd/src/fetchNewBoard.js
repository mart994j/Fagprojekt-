let isFetching = false;

export const fetchNewBoard = ({
  n, // Adding n as a parameter
  setGrid,
  setEditableCells,
  setUserEdits,
  setValidity,
  setIsDataLoaded,
  setTimer,
  setIsTimerActive
}) => {
  // Early return if already fetching
  if (isFetching) return;
  isFetching = true;

  // Update the URL to include the size n as a query parameter
  fetch(`http://localhost:3000/generate?size=${n}`)
    .then(response => response.json())
    .then(data => {
      // Set grid based on fetched data
      setGrid(data.board);
      // Calculate which cells are editable (where value is 0)
      const editable = data.board.map(row => row.map(value => value === 0));
      setEditableCells(editable);
      // Update userEdits and validity based on the dynamic size of n
      setUserEdits(Array(n).fill().map(() => Array(n).fill(false)));
      setValidity(Array(n).fill().map(() => Array(n).fill(true)));
      setIsDataLoaded(true);
      setTimer(0);
      setIsTimerActive(true);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
      setIsDataLoaded(false); // Handle error state correctly
    })
    .finally(() => {
      // Reset isFetching to allow new fetches
      isFetching = false;
    });
};
