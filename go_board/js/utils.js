initializeEmptyGrid = function(boardSize) {
  var rows = [];
  for (var y = 0; y < boardSize; y++) {
    row = [];
    for (var x = 0; x < boardSize; x++) {
        row[x] = null;
    }
    rows[y] = row;
  }
  return rows;
}

getColor = function(turn) {
  return turn % 2 === 0 ? "black" : "white";
}
