drawGrid = function(context, boardSize, gridWidth) {
  var boardWidth = gridWidth * (boardSize - 1);

  context.beginPath();
  for (var i = 0; i < boardSize; i++) {
    var start = i * gridWidth;

    context.moveTo(start, 0);
    context.lineTo(start, boardWidth);

    context.moveTo(0, start);
    context.lineTo(boardWidth, start);
  }
  context.stroke();
}

getStarPointCoords = function(gridWidth, line, starPointWidth) {
  return (line * gridWidth) - (starPointWidth / 2)
}

drawStarPoints = function(context) {
  var starPointWidth = 5;
  var lines = [3, 9, 15];
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 3; x++) {
      var xCoords = getStarPointCoords(gridWidth, lines[x], starPointWidth);
      var yCoords = getStarPointCoords(gridWidth, lines[y], starPointWidth);
      context.fillRect(xCoords, yCoords, starPointWidth, starPointWidth);
    }
  }
}

drawStone = function(context, gridWidth, x, y, color) {
  var offset = gridWidth / 3
  x = x * gridWidth - offset;
  y = y * gridWidth - offset;
  var stoneWidth = (gridWidth * 2) / 3

  context.beginPath();
  context.setFillColor(color);
  context.rect(x, y, stoneWidth, stoneWidth);
  context.fillRect(x + 1, y + 1, stoneWidth - 2, stoneWidth - 2);
  context.stroke();
  context.setFillColor("black");
}

drawStones = function(context, boardSize, gridWidth, state) {
  for (var y = 0; y < boardSize; y++) {
    for (var x = 0; x < boardSize; x++) {
      var stone = state[y][x];
      if (stone != null) {
        drawStone(context, gridWidth, x, y, getColor(stone));
      }
    }
  }
}

markLatestMove = function(context, gridWidth, x, y) {
  var offset = gridWidth / 6;
  x = x * gridWidth - offset;
  y = y * gridWidth - offset;
  var markWidth = gridWidth / 3;

  context.beginPath();
  context.setStrokeColor("red");
  context.rect(x, y, markWidth, markWidth);
  context.stroke()
  context.setStrokeColor("black");
}

drawCaptures = function(captures) {
  var captured = document.getElementById("captured");
  captured.innerHTML = "Captured: " + captures['white'] + "w " + captures['black'] + "b";
}

drawBoard = function(context, boardSize, gridWidth, state, captures, moves) {
  var contextWidth = (boardSize + 1) * gridWidth;

  context.width = contextWidth;
  context.height = contextWidth;
  context.clearRect(0, 0, contextWidth, contextWidth);

  drawGrid(context, boardSize, gridWidth);
  drawStarPoints(context);
  drawStones(context, boardSize, gridWidth, state);
  drawCaptures(captures);

  if (moves.length > 0) {
    var latest = moves[moves.length - 1];
    markLatestMove(context, gridWidth, latest.x, latest.y);
  }
}
