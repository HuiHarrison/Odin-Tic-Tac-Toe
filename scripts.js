// Board Module
const Board = function() {
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
}

// Player Module
const Player = function() {
    let playerTurn = "X";
    
    const getPlayerTurn = () => playerTurn;
    
    const switchPlayerTurn = () => {
        playerTurn = playerTurn === "X" ? "O" : "X";
    }
    
    return {getPlayerTurn, switchPlayerTurn}
}

// Game Control Module
const GameController = function(board) {
    const player = Player();

    const _getInput = () => {
        let inputPrompt = prompt(`Player ${player.getPlayerTurn()}: Which squre do you want to take? (input y follow by x e.g. 21)`);
        const inputY = inputPrompt[0];
        const inputX = inputPrompt[1];
        return {inputY, inputX}
    }

    const validateInput = () => {
        const coordinate = _getInput();

        if (board.checkBoxOccupied(coordinate.inputY, coordinate.inputX)) {
            console.log("Already Occupied");
            return validateInput();
        }
        else {
            board.setMark(player.getPlayerTurn(), coordinate.inputY, coordinate.inputX);
            player.switchPlayerTurn();
            console.log(board.getBoard());
        }
    }

    return {validateInput}
}

const Main = function() {
    const board = Board();
    const gameController = GameController(board);

    let isGameOver =false;
    while (!isGameOver) {
        gameController.validateInput();

        let winner = board.checkWin()
        if (winner !== null) {
            isGameOver = true
            console.log(`The Winner is Player ${winner}`);
        }
        else if (board.checkDraw()) {
            isGameOver = true
            console.log(`Draw`);
        }
    }
}

// Main();