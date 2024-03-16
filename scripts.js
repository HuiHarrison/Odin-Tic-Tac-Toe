// Board Module
const Board = (function() {
    const rows = 3;
    const columns = 3;
    let board = [];

    // Create " " rows * colums
    for (let y=0; y < rows; y++) {
        board[y] = [];
        for (let x=0; x < columns; x++) {
            board[y][x] = " ";
        }
    }

    const getBoard = () => board;

    const checkBoxOccupied = (posY, posX) => {
        return board[posY][posX] !== " "
    }

    const setMark = (mark, posY, posX) => {
        board[posY][posX] = mark;
    }

    const checkWin = () => {
        const board = getBoard();

        // horizontal
        for (let y=0; y < rows; y++) {
            if ((board[y][0] !== " ") && (board[y][0] === board[y][1]) && (board[y][1] === board[y][2])) {
                return board[y][0];
            }
        }

        // vertical
        for (let x=0; x<columns; x++) {
            if ((board[0][x] !== " ") && (board[0][x] === board[1][x]) && (board[1][x] === board[2][x])) {
                return board[0][x];
            }
        }

        // diagonal top left to bottom right
        if ((board[0][0] !== " ") && (board[0][0] === board[1][1]) && (board[1][1] === board[2][2])) {
            return board[0][0];
        }

        // diagonal top right to bottom left
        if ((board[0][2] !== " ") && (board[0][2] === board[1][1]) && (board[1][1] === board[2][0])) {
            return board[0][0];
        }

        return null;
    }

    const checkDraw = () => {
        const flatBoard = board.flat();
        return (!flatBoard.includes(" "))
    }

    return {getBoard, setMark, checkBoxOccupied, checkWin, checkDraw}
})();

// Player Module
const Player = (function() {
    let playerTurn = "X";
    
    const getPlayerTurn = () => playerTurn;
    
    const switchPlayerTurn = () => {
        playerTurn = playerTurn === "X" ? "O" : "X";
    }
    
    return {getPlayerTurn, switchPlayerTurn}
})();

// Game Control Module
const GameController = (function() {

    const indexToCoordinate = (index) => {
        posY = Math.floor(index / 3);
        posX = Math.floor(index % 3);
        return {posY, posX};
    }

    const update = (index) => {
        const coordinate = indexToCoordinate(index);

        if (Board.checkBoxOccupied(coordinate.posY, coordinate.posX)) {
            console.log("Already Occupied");
        }
        else {
            Board.setMark(Player.getPlayerTurn(), coordinate.posY, coordinate.posX);
            Player.switchPlayerTurn();
            Page.updateTurnTextDiv();
        }
    }

    return {update}
})();

// Page Module
const Page = (function() {
    const mainTag = document.querySelector("main");
    const turnTextDiv = mainTag.querySelector(".turn-text");
    const playerSpan = turnTextDiv.querySelector("span");
    const boardDiv = mainTag.querySelector(".board");
    const boxDivs = boardDiv.querySelectorAll(".box");

    const updateTurnTextDiv = () => {
        playerSpan.innerText = Player.getPlayerTurn();
    };

    const getBoardDiv = () => boardDiv;

    const getBoxDivs = () => boxDivs;

    return {updateTurnTextDiv, getBoardDiv, getBoxDivs}
})()

const Main = function() {
    for (let i = 0; i < Page.getBoxDivs().length; i++) {
        Page.getBoxDivs()[i].addEventListener("click", function() {
            GameController.update(i);
            console.log(Board.getBoard());

            let winner = Board.checkWin()
            if (winner !== null) {
                isGameOver = true
                console.log(`The Winner is Player ${winner}`);
            }
            else if (Board.checkDraw()) {
                isGameOver = true
                console.log(`Draw`);
            }
        });
    }
}

Main();