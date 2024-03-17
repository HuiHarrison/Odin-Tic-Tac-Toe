// Board Module
const Board = (function() {
    const rows = 3;
    const columns = 3;
    let board = [];

    // Create " " colums * rows in board[]
    for (let y=0; y < columns; y++) {
        board[y] = [];
        for (let x=0; x < rows; x++) {
            board[y][x] = " ";
        }
    }

    const resetBoard = () => {
        for (let y=0; y < columns; y++) {
            for (let x=0; x < rows; x++) {
                board[y][x] = " ";
            }
    }
}

    const getBoard = () => board;

    const checkBoxOccupied = (posY, posX) => {
        return board[posY][posX] !== " "
    }

    const setMark = (mark, posY, posX) => {
        board[posY][posX] = mark;
    }

    const _checkDraw = () => {
        const flatBoard = board.flat();
        return (!flatBoard.includes(" "))
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
            return board[0][2];
        }

        // Check Draw
        if (_checkDraw()) {
            return "draw"
        }

        return null;
    }

    return {getBoard, setMark, checkBoxOccupied, checkWin, resetBoard}
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

    const _indexToCoordinate = (index) => {
        posY = Math.floor(index / 3);
        posX = Math.floor(index % 3);
        return {posY, posX};
    }

    const update = (index) => {
        const coordinate = _indexToCoordinate(index);

        if (Board.checkBoxOccupied(coordinate.posY, coordinate.posX)) {
            console.log("Already Occupied");
        }
        else {
            let playerTurn = Player.getPlayerTurn();
            Board.setMark(playerTurn, coordinate.posY, coordinate.posX);
            Page.addElementToBox(index, playerTurn)
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
    const gameEndDialog = document.querySelector("#game-end");
    const gameEndText = gameEndDialog.querySelector("#game-end-text");
    const restartBtn = gameEndDialog.querySelector("#restart-btn");

    const updateGameEndText = (mark) => {
        if (mark === "draw") {
            gameEndText.innerText = "Draw!";
        }
        else {
            gameEndText.innerText = `Player ${mark} Won!`;
        }
    };

    const displayGameEndDialog = () => {
        gameEndDialog.showModal();
    }

    const updateTurnTextDiv = () => {
        playerSpan.innerText = Player.getPlayerTurn();
    };

    const getBoardDiv = () => boardDiv;

    const getBoxDivs = () => boxDivs;

    const addElementToBox = (index, mark) => {
        const item = document.createElement("i");
        item.classList.add("fa-sharp");
        if (mark === "X") {
            item.classList.add("fa-solid");
            item.classList.add("fa-x");
        }
        else if (mark === "O") {
            item.classList.add("fa-regular");
            item.classList.add("fa-circle");
        }
        
        boxDivs[index].appendChild(item);
    }

    const _restart = () => {
        Board.resetBoard();
        for (box of boxDivs) {
            box.innerText = "";
        }
        gameEndDialog.close();
    }
    restartBtn.addEventListener("click", _restart);

    return {updateTurnTextDiv, getBoardDiv, getBoxDivs, addElementToBox, updateGameEndText, displayGameEndDialog}
})()

const Main = function() {
    for (let i = 0; i < Page.getBoxDivs().length; i++) {
        Page.getBoxDivs()[i].addEventListener("click", function() {
            GameController.update(i);
            console.log(Board.getBoard());

            let winner = Board.checkWin()
            if (winner !== null) {
                Page.updateGameEndText(winner);
                Page.displayGameEndDialog();

            }
        });
    }
}

Main();