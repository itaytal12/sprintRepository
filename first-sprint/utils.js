"use strict";

function onInit() {
  gBoard = createBoard();
  renderBoard();
}

/////////////////////////////////////////////////////////
//-------------------Boards and Mats------------------//
///////////////////////////////////////////////////////
function createMat(rowIdx, colIdx) {
  const mat = [];
  for (var i = 0; i < rowIdx; i++) {
    const row = [];
    for (var j = 0; j < colIdx; j++) {
      row.push("♻️");
    }
    mat.push(row);
  }
  return mat;
}

function createBoard() {
  const board = [];
  for (var i = 0; i < 10; i++) {
    board[i] = [];
    for (var j = 0; j < 10; j++) {
      board[i][j] = {
        type: FLOOR,
        gameElement: null,
      };
      if (i === 0 || i === 10 || j === 0 || j === 10) {
        board[i][j].type = WALL;
      }
    }
  }
}

function checkNeighbors(board, rowIdx, colIdx) {
  var count = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[0].length) continue;
      console.log("board[i][j]", board[i][j]);
      var currCell = board[i][j];
      if (currCell.isSeat && !currCell.isBooked) {
        count++;
      }
    }
  }
  return count;
}

function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j];
      if (currCell.type === FLOOR && currCell.gameElement === null)
        emptyCells.push({ i, j });
    }
  }
  if (!emptyCells.length) return null;
  return emptyCells;
}

function renderBoard(mat, selector) {

  var strHTML = '<table border="0"><tbody>'
  for (var i = 0; i < mat.length; i++) {

      strHTML += '<tr>'
      for (var j = 0; j < mat[0].length; j++) {

          const cell = mat[i][j]
          const className = 'cell cell-' + i + '-' + j
          strHTML += `<td class="${className}">${cell}</td>`
      }
      strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'
  
  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}
////////////////////////////////////////////
//-----------------Rendering-------------//
//////////////////////////////////////////

// --> Renders into an already made board in the HTML
function renderCinema() {
  var strHTML = "";
  for (var i = 0; i < gCinema.length; i++) {
    strHTML += `<tr class="cinema-row" >\n`;
    for (var j = 0; j < gCinema[0].length; j++) {
      const cell = gCinema[i][j];
      // For cell of type SEAT add seat class:
      var className = cell.isSeat ? "seat" : "";
      if (cell.isBooked) {
        className += " booked";
      }
      // Add a seat title:
      const title = `Seat: ${i + 1}, ${j + 1}`;
      strHTML += `\t<td data-i="${i}" data-j="${j}"
                              title="${title}" class="cell ${className}" 
                              onclick="onCellClicked(this, ${i}, ${j})" >
                           </td>\n`;
    }
    strHTML += `</tr>\n`;
  }
  const elSeats = document.querySelector(".cinema-seats");
  elSeats.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}
// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

/////////////////////////////////////////
//-----------------Randoms-------------//
////////////////////////////////////////

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
  // The maximum is exclusive and the minimum is inclusive
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/////////////////////////////////////////////////////
//--------------extra shit and sheet--------------//
////////////////////////////////////////////////////
function makeId(length = 6) {
  var txt = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function handleModal() {
  gElModal.classList.toggle("hidden");
  /* <div class='modal hidden'>modal</div> */
}

function playSound() {
  const audio = new Audio("filename.type");
  audio.play();
}

function onHandleKey(event) {
  const i = gGamerPos.i;
  const j = gGamerPos.j;
  switch (event.key) {
    case "ArrowLeft":
    case "a":
      moveTo(i, j - 1);
      break;
    case "ArrowRight":
    case "d":
      moveTo(i, j + 1);
      break;
    case "ArrowUp":
    case "w":
      moveTo(i - 1, j);
      break;
    case "ArrowDown":
    case "s":
      moveTo(i + 1, j);
      break;
  }
}
function getNextLocation(eventKeyboard) {
  var nextLocation = {
      i: gPacman.location.i,
      j: gPacman.location.j
  }
  switch (eventKeyboard.code) {
      case 'ArrowUp':
          nextLocation.i--;
          break;
      case 'ArrowDown':
          nextLocation.i++;
          break;
      case 'ArrowLeft':
          nextLocation.j--;
          break;
      case 'ArrowRight':
          nextLocation.j++;
          break;
      default:
          return null;
  }
  return nextLocation;
}

var gTimer = 0
var gIntervalId = null
function renderTimer() {
 var gElTimer = document.querySelector('.timer')
 console.log(gElTimer)
 var stopWatch = +gTimer.toFixed(2)
 gElTimer.innerText = stopWatch
}

function startTimer() {
 gIntervalId = setInterval(() => {
  gTimer += 0.01
  renderTimer()
 }, 100)
}

function moveTo(i, j) {

	const targetCell = gBoard[i][j]
	if (targetCell.type === WALL) return

	// Calculate distance to make sure we are moving to a neighbor cell
	const iAbsDiff = Math.abs(i - gGamerPos.i)
	const jAbsDiff = Math.abs(j - gGamerPos.j)

	// If the clicked Cell is one of the four allowed
	// if (iAbsDiff + jAbsDiff === 1)
	if ((iAbsDiff === 1 && jAbsDiff === 0) ||
		(jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!')
		}

		// TODO: Move the gamer
		//REMOVE FROM
		// MODEL
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
		// DOM
		renderCell(gGamerPos, '')

		// ADD TO
		// MODEL
		gGamerPos.i = i
		gGamerPos.j = j
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER
		// DOM
		renderCell(gGamerPos, GAMER_IMG)




	} else {
		// console.log('TOO FAR', iAbsDiff, jAbsDiff)
	}

}

function buildBoard() {
	const board = []
	// DONE: Create the Matrix 10 * 12 

	for (var i = 0; i < 10; i++) {
		board[i] = []
		for (var j = 0; j < 12; j++) {
			// DONE: Put FLOOR everywhere and WALL at edges
			board[i][j] = { type: FLOOR, gameElement: null }
			if (i === 0 || i === 9 ||
				j === 0 || j === 11) {
				board[i][j].type = WALL
			}
		}
	}
	// DONE: Place the gamer and two balls
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
	board[5][5].gameElement = BALL
	board[7][2].gameElement = BALL
	// console.log(board)
	return board
}

function setLevel(num) {
  gCurrLevel = +num
  // gCurrLevel global var
  resetGame()
  return gCurrLevel
}

//shuffle my array
function shuffleBoard(board) {
  for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = board[i]
      board[i] = board[j]
      board[j] = temp
  }
  return board
}