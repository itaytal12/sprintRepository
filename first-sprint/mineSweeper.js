'use strict'
//To do : check win: all all the mines are flagged, and all the other cells are shown
var MINE = '💣'
var FLAG = '🚩'
var gBoard

var gMinesAroundCount = 0
var gIsMarked = false
var gOpenedCells = []

var gLives = 3

var levels = {
    beginner: {
        SIZE: 4,
        MINES: 2,
    },
    medium: {
        SIZE: 8,
        MINES: 14,
    },
    expert: {
        SIZE: 12,
        MINES: 32,
    },
};


var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gLives 
    gOpenedCells = []
    gBoard = buildBoard()
    renderBoard(gBoard);
    placeRandomMines(gBoard)
    const elModal = document.querySelector('.hide')
    elModal.style.display = 'none'
    var elVictory = document.querySelector('.victory');
    elVictory.style.display = 'none';
    
    var elOver = document.querySelector('.gameOver')
        elOver.style.display = 'none'
       updateLivesDisplay()
}

function setLevel(level) {

    var selectedLevel = levels[level];


    gLevel.SIZE = selectedLevel.SIZE;
    gLevel.MINES = selectedLevel.MINES;

    onInit();

    return gLevel.SIZE;
}

function buildBoard() {
    const board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {

                isShown: false,
                isMine: false,
                isMarked: false,
                content: '',
                isFlagged: false ,
                negsCount:setMinesNegsCount(board,i,j)
                
                
            }
            //  board[i][j].negsCount =setMinesNegsCount(board,i,j)
        }
    }
    // board[1][1].content = MINE
    // board[3][3].content = MINE
    console.log(board);
    return board
}
function renderBoard(board) {
    // console.log('board:', board
    var strHTML = ''
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = board[i][j]
            // console.log('cell:', cell)
            var className = 'cell cell' + i + '-' + j
            var content = cell.isMarked ? FLAG : cell.isShown ? cell.content : '';

            if (cell.isShown && cell.content === '' && cell.negsCount > 0) {
                content = cell.negsCount;
            }
            strHTML += `\t<td class="${className} cover"
          onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(event, ${i}, ${j})">${content}
        
          </td>`


            setMinesNegsCount(gBoard, i, j)
        }
        strHTML += '</tr>\n'

    }



    document.querySelector('table').innerHTML = strHTML
}



function setMinesNegsCount(board,  rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (j < 0 || j >= board[0].length) continue;
            console.log("board[i][j]", board[i][j]);
            var currentCell = board[i][j];
            if (currentCell.content === MINE) count++
        }
    }
    return count;
}






function onCellMarked(event, i, j) {
    console.log(cell);
    event.preventDefault();

    var cell = gBoard[i][j];
    if (!cell.isShown) {
        if (cell.isMarked) {
            cell.isMarked = false;
            event.target.innerText = ''
        } else {
            cell.isMarked = true;
            event.target.innerText = FLAG
        }
    }
}



function onCellClicked(elCell, i, j) {
    if (gLives === 0) {
        return
    }
    console.log('i:', i)
    console.log('j:', j)
    var cell = gBoard[i][j]
    if (cell.isMarked) {
        return
    }
    if (cell.innerText === FLAG) {

        return
    }
    if (cell.content === MINE) {
        console.log('cell', cell);
        // gMinesAroundCount++
        elCell.innerText = MINE

        gLives--
        updateLivesDisplay()
        gameOver()
        renderBoard(gBoard)
        // console.log(gl);
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                if (gBoard[i][j].content === MINE) {
                    var mineCell = document.querySelector(`.cell${i}-${j}`);
                    mineCell.innerText = MINE;
                }

            }

        }
    }

    if (cell.content !== MINE) {
        var negs = setMinesNegsCount(gBoard, i, j)
        cell.negsCount = negs
        console.log('cell no mine:', cell)
        console.log('elCell:', elCell)
        elCell.innerText = cell.negsCount
    }

    if (cell.negsCount === 0) {
        expandCells(i, j)
        pushNegsCountToCells()

        elCell.innerText = cell.negsCount
        console.log( cell.negsCount);
    }

    if (!cell.isShown) {

        var negs = setMinesNegsCount(gBoard, i, j);
        cell.isShown = true;
        cell.negsCount = negs;
        elCell.innerText = cell.negsCount;
    }
    if (!cell.isMarked) {
        if (cell.content === MINE) {
            console.log('cell', cell);
            elCell.innerText = MINE;
            gameOver();
            return;
        }

    }



    if (checkVictory()) {
        var elVictory = document.querySelector('.victory');
        elVictory.style.display = 'block';
    }
}

function placeRandomMines(board) {
    var minesPlaced = 0;
    while (minesPlaced < gLevel.MINES) {
        var randomI = getRandomInt(0, gLevel.SIZE);
        var randomJ = getRandomInt(0, gLevel.SIZE);

        if (board[randomI][randomJ].content !== MINE) {
            board[randomI][randomJ].content = MINE;
            board[randomI][randomJ].isMine = true;
            minesPlaced++
        }
    }
}

function gameOver() {
    
    const elModal = document.querySelector('.hide')
    elModal.style.display = 'block'
     gGame.isOn = false
    if (gLives === 0) {
        var elOver = document.querySelector('.gameOver')
        elOver.style.display = 'block'
    }
     return
}

function checkVictory() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine && cell.isFlagged) {
                return true;
            }

            if (!cell.isMine && !cell.isShown) {
                return false;
            }
        }
    }

    return true;
}


function expandCells(rowIdx, colIdx) {
    
    var cell = gBoard[rowIdx][colIdx];
    if (cell.isShown || cell.isMarked) {
        return;
    }

    cell.isShown = true;
    var elCell = document.querySelector(`.cell${rowIdx}-${colIdx}`);
    elCell.innerText = cell.content === MINE ? MINE : cell.negsCount;

    if (cell.negsCount === 0) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (i < 0 || i >= gLevel.SIZE || j < 0 || j >= gLevel.SIZE || (i === rowIdx && j === colIdx)) {
                    continue;
                }
                var nextCell = gBoard[i][j];
                if (!nextCell.isShown && !nextCell.isMarked) {
                    expandCells(i, j);
                }
            }
        }
    }
    
}


function pushNegsCountToCells() {
    for (var i = 0; i < gOpenedCells.length; i++) {
        var openedCell = gOpenedCells[i];
        console.log(openedCell);
        var cell = gBoard[openedCell.row][openedCell.col]
        console.log(cell);
        cell.innerText = cell.negsCount
        cell.isShown = true;
    }
}

function updateLivesDisplay() {
    var elLives = document.querySelector('.lives');
    elLives.innerText = gLives;
}
