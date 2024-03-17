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

    function resetBoard() {
        for (let y=0; y < columns; y++) {
            for (let x=0; x < rows; x++) {
                board[y][x] = " ";
            }
    }
}

    function getBoard() {
        return board;
    } 

    function checkBoxOccupied(posY, posX) {
        return board[posY][posX] !== " ";
    }

    function setMark(mark, posY, posX) {
        board[posY][posX] = mark;
    }

    function _checkDraw() {
        const flatBoard = board.flat();
        return (!flatBoard.includes(" "))
    }

    function checkWin() {
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
    let playerList =[];

    function addPlayerToList(player) {
        playerList.push(player);
    }

    function getPlayerList(){
        return playerList;
    }

    function createPlayer(name, mark) {
        return {
            name,
            mark
        }
    }

    let playerTurn = "X";
    
    function getPlayerTurn() {
        return playerTurn;
    }
    
    function switchPlayerTurn() {
        playerTurn = playerTurn === "X" ? "O" : "X";
    }

    function getPlayerTurnName() {
        for (let i=0; i<playerList.length; i++) {
            if (playerList[i].mark === playerTurn) {
                return playerList[i].name;
            }
        }
    }
    
    return {getPlayerTurn, switchPlayerTurn, createPlayer, addPlayerToList, getPlayerList, getPlayerTurnName}
})();

// Game Control Module
const GameController = (function() {

    function _indexToCoordinate(index) {
        posY = Math.floor(index / 3);
        posX = Math.floor(index % 3);
        return {posY, posX};
    }

    function update(index) {
        const coordinate = _indexToCoordinate(index);

        if (!Board.checkBoxOccupied(coordinate.posY, coordinate.posX)) {
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
    const nameForm = mainTag.querySelector("#name-form");
    const player1Input = nameForm.querySelector("#player1");
    const player2Input = nameForm.querySelector("#player2");
    const startBtn = nameForm.querySelector("#start-btn");

    function startGame(event) {
        event.preventDefault();
        nameForm.style.display = "none";
        turnTextDiv.style.display = "block";
        
        if (player1Input.value.length === 0) {
            player1Input.value = "Guest 1"
        }
        const player1 = Player.createPlayer(player1Input.value, "X");
        Player.addPlayerToList(player1);

        if (player2Input.value.length === 0) {
            player2Input.value = "Guest 2"
        }
        const player2 = Player.createPlayer(player2Input.value, "O");
        Player.addPlayerToList(player2);
        Page.updateTurnTextDiv();

    };
    startBtn.addEventListener("click", startGame);

    function updateGameEndText(mark) {
        if (mark === "draw") {
            gameEndText.innerText = "Draw!";
        }
        else {
            let playerList = Player.getPlayerList();
            for (let i=0; i<playerList.length; i++) {
                if (playerList[i].mark === mark) {
                    return gameEndText.innerText = `${playerList[i].name} Won!`;
                }
            }
        }
    };

    function displayGameEndDialog(){
        gameEndDialog.showModal();
    }

    function updateTurnTextDiv(){
        playerSpan.innerText = Player.getPlayerTurnName();
    };

    function getBoardDiv() {
        return boardDiv;
    }
    

    function getBoxDivs() {
        return boxDivs;
    }

    function addElementToBox(index, mark) {
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

    function _restart() {
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

            // Check Win/Draw
            let winner = Board.checkWin()
            if (winner !== null) {
                Page.updateGameEndText(winner);
                Page.displayGameEndDialog();
            }
        });
    }
}

Main();