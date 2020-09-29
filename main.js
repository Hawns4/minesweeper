document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    let cells = []
    let height = 10;
    let width = 10;
    let totalBombs = 20;
    let isGameOver = false;
    let flagsUsed = 0;

    // Create board
    function createBoard() {
        // Create game cells
        const bombs = Array(totalBombs).fill('bomb');
        const numbers = Array(height * width - totalBombs).fill('number')
        const boardArray = numbers.concat(bombs);
        const gameArray = boardArray.sort(() => Math.random() - 0.5)

        // Create cells
        for (let i = 0; i < height * width; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i)
            cell.classList.add(gameArray[i])
            board.appendChild(cell);
            cells.push(cell);

            // Left click
            cell.addEventListener('click', (e) => {
                click(cell);
            })

            // Right click
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                addFlag(cell);
            }
        }

        // Add numbers to cells
        for (let i = 0; i < gameArray.length; i++) {
            let total = 0;
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width - 1;

            if (cells[i].classList.contains('number')) {
                // Check left
                if (!isLeftEdge && cells[i - 1].classList.contains('bomb')) total++;
                // Check right
                if (!isRightEdge && cells[i + 1].classList.contains('bomb')) total++;
                // Check top
                if (i >= width && cells[i - width].classList.contains('bomb')) total++;
                // Check bottom
                if (i < ((height - 1) * width) && cells[i + width].classList.contains('bomb')) total++;
                // Check top left
                if (i > width && !isLeftEdge && cells[i - width - 1].classList.contains('bomb')) total++;
                // Check top right
                if (i >= width && !isRightEdge && cells[i - width + 1].classList.contains('bomb')) total++;
                // Check bottom left
                if (i < ((height - 1) * width) && !isLeftEdge && cells[i + width - 1].classList.contains('bomb')) total++;
                // Check bottom right
                if (i < ((height - 1) * width) && !isRightEdge && cells[i + width + 1].classList.contains('bomb')) total++;

                cells[i].setAttribute('bombs', total);
                console.log(cells[i]);
            }
        }
    }

    createBoard();

    // Left click
    click = (cell) => {
        if (isGameOver) return;
        if (cell.classList.contains('clicked') || cell.classList.contains('flagged')) return;
        if (cell.classList.contains('bomb')) {
            gameOver();
        } else {
            let total = cell.getAttribute('bombs');
            cell.classList.add('clicked');
            if (total != 0) {
                cell.innerHTML = total;
                return;
            }
            checkCell(cell);
        }
    }

    // Right click
    addFlag = (cell) => {
        if (isGameOver) return;
        if (!cell.classList.contains('clicked') && (flagsUsed < totalBombs)) {
            if (!cell.classList.contains('flagged')) {
                cell.classList.add('flagged');
                cell.innerHTML = '🚩';
                flagsUsed++;
            } else {
                cell.classList.remove('flagged');
                cell.innerHTML = '';
                flagsUsed--;
            }
        }
        checkWin();
    }

    // Check surrounding cells and automatically click if 0
    checkCell = (cell) => {
        const cellID = parseInt(cell.id);
        const isLeftEdge = cellID % width === 0;
        const isRightEdge = cellID % width === width - 1;

        setTimeout(() => {
            // Check left
            if (!isLeftEdge) click(document.getElementById(cellID - 1));
            // Check right
            if (!isRightEdge) click(document.getElementById(cellID + 1));
            // Check top
            if (cellID >= width) click(document.getElementById(cellID - width));
            // Check bottom
            if (cellID < ((height - 1) * width)) click(document.getElementById(cellID + width));
            // Check top left
            if (cellID > width && !isLeftEdge) click(document.getElementById(cellID - width - 1));
            // Check top right
            if (cellID >= width && !isRightEdge) click(document.getElementById(cellID - width + 1));
            // Check bottom left
            if (cellID < ((height - 1) * width) && !isLeftEdge) click(document.getElementById(cellID + width - 1));
            // Check bottom right
            if (cellID < ((height - 1) * width) && !isRightEdge) click(document.getElementById(cellID + width + 1));
        }, 30)

    }

    gameOver = () => {
        isGameOver = true;
        cells.forEach(cell => {
            if (cell.classList.contains('bomb')) {
                cell.innerHTML = '💣'
            }
        })
    }

    checkWin = () => {
        let isAllBombsFlagged = cells.filter(cell => cell.classList.contains('bomb') && cell.classList.contains('flagged')).length === totalBombs;
        let isAllNumbersClicked = cells.filter(cell => cell.classList.contains('number') && cell.classList.contains('clicked')).length === width * height - totalBombs;
        if (isAllBombsFlagged && isAllNumbersClicked) {
            isGameOver = true;
        }
    }

});