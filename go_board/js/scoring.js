drawScore = function(score) {
  var scoreDiv = document.getElementById("score");
  if (score > 0) {
    scoreDiv.innerHTML = "Black wins by " + score + " points!";
  } else if (score < 0) {
    scoreDiv.innerHTML = "White wins by " + (0 - score) + " points!";
  } else {
    scoreDiv.innerHTML = "It's a tie! Gosh, you should've set some komi."
  }
}

findNeighbors = function(x, y) {
  var out = [];
  if (x > 0) {
    out.push({'x' : x - 1, 'y' : y});
  }
  if (x < 18) {
    out.push({'x' : x + 1, 'y' : y});
  }
  if (y > 0) {
    out.push({'x' : x, 'y' : y - 1});
  }
  if (y < 18) {
    out.push({'x' : x, 'y' : y + 1});
  }
  return out;
}

isNewlyDiscoveredDame = function(initialColor, newlyEncounteredColor) {
  var bothColorsAreSet = initialColor != null && newlyEncounteredColor != null
  var colorsConflict = bothColorsAreSet && initialColor != newlyEncounteredColor
  return newlyEncounteredColor === 'dame' || colorsConflict
}

isPreviouslyEncounteredDame = function(scoreboard, x, y) {
  return scoreboard[y][x] === 'dame';
}

stoneNeedsToBeSeen = function(scoreboard, x, y) {
  return scoreboard[y][x] === null;
}

markStone = function(status, scoreboard, x, y) {
  scoreboard[y][x] = status;
}

dameRegionScore = {'color' : 'dame', 'score' : 0};

scoreRegion = function(state, scoreboard, x, y) {
  markStone('seen', scoreboard, x, y);
  var score = 1;
  var color = null;

  var neighbors = findNeighbors(x, y);
  for (var i = 0; i < neighbors.length; ++i) {
    var neighbor = neighbors[i];
    if (isPreviouslyEncounteredDame(scoreboard, neighbor.x, neighbor.y)) {
      return dameRegionScore;
    } else if (stoneNeedsToBeSeen(scoreboard, neighbor.x, neighbor.y)) {
      var stone = state[neighbor.y][neighbor.x];
      if (stone === null) {
        var regionScore = scoreRegion(state, scoreboard, neighbor.x, neighbor.y);
        if (isNewlyDiscoveredDame(color, regionScore.color)) {
          markStone('dame', scoreboard, x, y);
          return dameRegionScore;
        } else {
          color = color || regionScore.color;
          score += regionScore.score;
        }
      } else {
        var stoneColor = getColor(stone);
        if (color != null && color != stoneColor) {
          markStone('dame', scoreboard, x, y);
          return dameRegionScore;
        } else {
          color = stoneColor;
        }
      }
    }
  }
  return {'color' : color, 'score' : score};
}

scoreBoard = function(state, boardSize) {
  var scoreboard = initializeEmptyGrid(boardSize);
  var score = 0;
  for (var y = 0; y < boardSize; y++) {
    for (var x = 0; x < boardSize; x++) {
      if (state[y][x] === null && stoneNeedsToBeSeen(scoreboard, x, y)) {
        var regionScore = scoreRegion(state, scoreboard, x, y);
        if (regionScore.color === 'white') {
          score -= regionScore.score;
        } else {
          score += regionScore.score;
        }
      }
    }
  }
  drawScore(score);
}
