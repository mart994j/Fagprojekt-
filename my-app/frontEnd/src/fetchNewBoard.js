export const fetchNewBoard = ({
    setGrid,
    setEditableCells,
    setUserEdits,
    setValidity,
    setIsDataLoaded,
    setTimer,
    setIsTimerActive
  }) => {
    fetch('http://localhost:3000/generate')
      .then(response => response.json())
      .then(data => {
        setGrid(data.board);
        const editable = data.board.map(row => row.map(value => value === 0));
        setEditableCells(editable);
        setUserEdits(Array(9).fill().map(() => Array(9).fill(false)));
        setValidity(Array(9).fill().map(() => Array(9).fill(true)));
        setIsDataLoaded(true);
        setTimer(0);
        setIsTimerActive(true);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  };
  