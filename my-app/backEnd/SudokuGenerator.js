/*
***Beskrivelsen af algoritmen er lavet af Chatgpt***

***KORT BESKRIVELSE AF ALGORITMEN***
Vælger celler baseret på antallet af kandidater færrest først for at minimere gæt.
Går tilbage til tidligere kandidat state ved backtracking, hvis der ikke er nogen gyldige kandidater. 
istedet for at rulle tilbage til starten af algoritmen.
Tjekker herefter sudoku regler for at sikre at nummeret kan stå i cellen.


***LANG BESKRIVELSE AF ALGORITMEN***
Algoritmen genererer et Sudoku-bræt af en given størrelse ved først at oprette et tomt bræt og en 
tilsvarende struktur for at holde styr på mulige tal (kandidater) for hver celle. 
Herefter anvendes en kombination af rekursion og backtracking for intelligent at fylde brættet med tal, 
idet der sikres, at Sudokuens regler overholdes. Algoritmen optimerer processen ved dynamisk at spore 
ændringer i kandidater for at minimere unødvendig beregning og hukommelsesbrug.

Kernekomponenter
Initialisering af Bræt og Kandidater: Brættet initialiseres med nuller, og for hver celle 
oprettes et sæt af kandidater, som repræsenterer mulige tal, der kan placeres i cellen.

Intelligent Fyldning med Backtracking: Algoritmen vælger den celle med færrest kandidater for at minimere
antallet af gæt. For hver valgt celle forsøges hvert muligt tal (kandidat) placeret under 
overholdelse af Sudokuens regler. Hvis et tal er gyldigt, opdateres brættet og kandidaterne rekursivt. 
Dette skridt inkluderer dynamisk sporing af ændringer i kandidater for at muliggøre effektiv backtracking.

Dynamisk Kandidatsporing: Ved at placere et tal i en celle opdateres kandidatsættene for alle relaterede 
celler (i samme række, kolonne og boks) in-place, og disse ændringer spores. 
Hvis det bliver nødvendigt at backtracke, anvendes de sporede ændringer til at 
genskabe den tidligere tilstand af kandidatsæt.


Backtracking: Hvis en celle ikke kan fyldes med nogen gyldige tal 
(dvs., alle kandidater er blevet afprøvet og afvist), backtrackes algoritmen ved at 
nulstille cellen og gendanne kandidatsættets tidligere tilstand, hvorefter den forsøger
alternativer for tidligere celler.




*/

class SudokuGenerator {
  // Generate a new Sudoku board of variable size
  static generateBoard(size = 9) {

    // Check if the size is valid
    let board = Array.from({ length: size }, () => Array(size).fill(0));
    //en kandidat er et tal der kan stå i en celle dvs 
    let candidates = Array.from({ length: size }, () =>
      //array.from laver et array med en længde og en funktion der udfylder arrayet
      Array.from({ length: size }, () => new Set(Array.from({ length: size }, (_, index) => index + 1)))
    );
    if (this.fillBoard(board, size, candidates)) {
      this.swapRows(board, size);
      this.swapColumns(board, size);
      return board;
    }
  }
 
  //fill fylder boardet med tal sådan at den ikke skal bruge backtracking
  static fillBoard(board, size, candidates) {
    //find den celle med færrest kandidater
    let [row, col] = this.findCellWithFewestCandidates(board, candidates, size);
    //hvis der ikke er nogen celler med kandidater, er brættet fyldt
    if (row === -1) {
      return true; // Board is filled
    }
    //lav en liste over kandidaterne
    let possibleNumbers = Array.from(candidates[row][col]);
    for (let num of possibleNumbers) {
      if (this.isValidPlacement(board, row, col, num, size)) {
        //hvis nummeret kan stå i cellen, så sæt det i cellen
        board[row][col] = num;
        //opdater kandidaterne hvis nummeret er sat i cellen
        const changes = this.updateCandidates(candidates, row, col, num, size, true); // Pass true to track changes
        if (this.fillBoard(board, size, candidates)) {
          //hvis brættet er fyldt, returner true
          return true;
        }
        //hvis brættet ikke er fyldt, så fjern nummeret fra cellen og opdater kandidaterne
        this.revertCandidatesChanges(candidates, changes); 
        
        board[row][col] = 0;
      }
    }
    return false; // Trigger backtrack
  }

  // Check if a number is validly placed
  static isValidPlacement(board, row, col, num, size) {
    const boxSize = Math.sqrt(size);
    for (let i = 0; i < size; i++) {
      const m = boxSize * Math.floor(row / boxSize) + Math.floor(i / boxSize);
      const n = boxSize * Math.floor(col / boxSize) + i % boxSize;
      if (board[row][i] === num || board[i][col] === num || board[m][n] === num) {
        return false;
      }
    }
    return true;
  }

  // Remove numbers from the board to create puzzles
  static removeNumbers(board, holes) {
    let attempts = holes;
    const size = board.length;
    while (attempts > 0) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        attempts--;
      }
    }
  }
  //funktionen tager et array af kandidater og et array af ændringer
  static revertCandidatesChanges(candidates, changes) {
    //for hver ændring i ændringerne så tilføj nummeret til cellen
    changes.forEach(change => {
      const [row, col, num] = change;
      candidates[row][col].add(num);
    });
  }

  //find den celle med færrest kandidater
  static findCellWithFewestCandidates(board, candidates, size) {
    let minCandidates = size + 1;
    let cell = [-1, -1];
    //for hver celle i brættet så find den celle med færrest kandidater
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0 && candidates[row][col].size < minCandidates) {
          //hvis der er en celle med færre kandidater end den nuværende celle, så sæt minCandidates til antallet af kandidater i cellen og sæt cell til cellen
          minCandidates = candidates[row][col].size;
          cell = [row, col];
        }
      }
    }
    return cell;
  }

  //opdater kandidaterne så nummeret ikke kan stå i cellen
  static updateCandidates(candidates, row, col, num, size, trackChanges = false) {
    let changes = [];
    const boxSize = Math.sqrt(size);
    for (let i = 0; i < size; i++) {
      if (candidates[row][i].delete(num)) changes.push([row, i, num]);
      if (candidates[i][col].delete(num)) changes.push([i, col, num]);
      //hvis der er ændringer i kandidaterne så tilføj ændringerne til changes

      // Box
      let boxRow = Math.floor(row / boxSize) * boxSize + Math.floor(i / boxSize);
      let boxCol = Math.floor(col / boxSize) * boxSize + (i % boxSize);
      if (boxRow < size && boxCol < size && candidates[boxRow][boxCol].delete(num)) {
        //hvis nummeret kan fjernes fra kandidaterne så tilføj ændringen til changes
        changes.push([boxRow, boxCol, num]);
      }
    }
    return trackChanges ? changes : null;
    //hvis trackChanges er true så returner changes ellers returner null
  }

  static swapRows(board, size) {
    const subGridSize = Math.sqrt(size);
    const numSwaps = Math.sqrt(size); // Adjust this number to increase or decrease the number of swaps
    for (let band = 0; band < size; band += subGridSize) {
        for (let swap = 0; swap < numSwaps; swap++) {
            // Randomly select two rows within this band to swap
            let row1 = band + Math.floor(Math.random() * subGridSize);
            let row2 = band + Math.floor(Math.random() * subGridSize);
            // Swap the rows
            [board[row1], board[row2]] = [board[row2], board[row1]];
        }
    }
}

static swapColumns(board, size) {
    const subGridSize = Math.sqrt(size);
    const numSwaps = Math.sqrt(size); // Adjust this number to increase or decrease the number of swaps
    for (let band = 0; band < size; band += subGridSize) {
        for (let swap = 0; swap < numSwaps; swap++) {
            // Randomly select two columns within this band to swap
            let col1 = band + Math.floor(Math.random() * subGridSize);
            let col2 = band + Math.floor(Math.random() * subGridSize);
            // Swap the columns
            for (let row = 0; row < size; row++) {
                [board[row][col1], board[row][col2]] = [board[row][col2], board[row][col1]];
            }
        }
    }
}


}




module.exports = { SudokuGenerator };
