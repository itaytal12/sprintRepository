'use strict'
var MINE = '💣'
var gBoard

var gMinesAroundCount = 0

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
    gBoard = buildBoard()
    renderBoard(gBoard);
    placeRandomMines(gBoard)
    const elModal = document.querySelector('.hide')
    elModal.style.display = 'none'

}

function buildBoard() {
    const board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {

                isShown: false,
                isMine: false,
                isMarked: true,
                content: ''
            }
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
            strHTML += `\t<td class="${className}"
          onclick="onCellClicked(this, ${i}, ${j})">
          ${cell.content}
          </td>`

        }
        strHTML += '</tr>\n'

    }
    console.log(cell);
    console.log(strHTML)
    document.querySelector('table').innerHTML = strHTML
    setMinesNegsCount(gBoard, i, j)
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (j < 0 || j >= board[0].length) continue;
            console.log("board[i][j]", board[i][j]);
            var cell = board[i][j];
            if (cell.content === MINE) count++


        }
    }
    return count
}

function onCellClicked(elCell, i, j) {
    console.log('i:', i)
    console.log('j:', j)
    var cell = gBoard[i][j]
    if (cell.content === MINE) {
        console.log('cell', cell);
        // gMinesAroundCount++
        elCell.innerText = MINE
        gameOver()
    }
    if (cell.content !== MINE) {
        var negs = setMinesNegsCount(gBoard, i, j)
        cell.negsCount = negs
        console.log('cell no mine:', cell)
        console.log('elCell:', elCell)
        elCell.innerText = cell.negsCount
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
}
