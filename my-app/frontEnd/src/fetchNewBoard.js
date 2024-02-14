export const fetchNewBoard = ({
  n, // Tilføj n som en parameter
  setGrid,
  setEditableCells,
  setUserEdits,
  setValidity,
  setIsDataLoaded,
  setTimer,
  setIsTimerActive
}) => {
  // Opdater URL'en til at inkludere størrelsen n som en query parameter
  fetch(`http://localhost:3000/generate?size=${n}`)
    .then(response => response.json())
    .then(data => {
      // Sætter grid baseret på den hentede data
      setGrid(data.board);
      // Beregner hvilke celler der er redigerbare (hvor værdien er 0)
      const editable = data.board.map(row => row.map(value => value === 0));
      setEditableCells(editable);
      // Opdaterer userEdits og validity baseret på den dynamiske størrelse af n
      setUserEdits(Array(n).fill().map(() => Array(n).fill(false)));
      setValidity(Array(n).fill().map(() => Array(n).fill(true)));
      setIsDataLoaded(true);
      setTimer(0);
      setIsTimerActive(true);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
      setIsDataLoaded(false); // Tilføj dette for at håndtere fejltilstand korrekt
    });
};
