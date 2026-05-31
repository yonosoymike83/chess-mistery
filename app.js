const pieces = {
    P:'♙',
    N:'♘',
    B:'♗',
    R:'♖',
    Q:'♕',
    K:'♔',

    p:'♟',
    n:'♞',
    b:'♝',
    r:'♜',
    q:'♛',
    k:'♚'
};

let puzzle;
let boardState = [];
let selected = null;

async function loadPuzzle(){

    const id =
        new URLSearchParams(location.search)
        .get("p") || "cache01";

    puzzle =
        await (
            await fetch(`puzzles/${id}.json`)
        ).json();

    document.getElementById("title").textContent =
        puzzle.title;

    document.getElementById("description").textContent =
        puzzle.description;

    loadFen(puzzle.fen);

    drawBoard();
}

function loadFen(fen){

    boardState = [];

    const rows =
        fen.split(" ")[0].split("/");

    for(const rowText of rows){

        const row = [];

        for(const char of rowText){

            if(!isNaN(char)){

                for(let i=0;i<parseInt(char);i++){

                    row.push("");

                }

            }else{

                row.push(char);

            }
        }

        boardState.push(row);
    }
}

function drawBoard(){

    const board =
        document.getElementById("board");

    board.innerHTML = "";

    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            const square =
                document.createElement("div");

            square.className =
                "square " +
                (((r+c)%2)
                    ? "dark"
                    : "light");

            if(
                selected &&
                selected.r===r &&
                selected.c===c
            ){
                square.classList.add(
                    "selected"
                );
            }

            square.dataset.r = r;
            square.dataset.c = c;

            square.textContent =
                pieces[
                    boardState[r][c]
                ] || "";

            square.onclick =
                handleClick;

            board.appendChild(square);
        }
    }
}

function toCoord(r,c){

    return "abcdefgh"[c] + (8-r);

}

function handleClick(event){

    const r =
        parseInt(
            event.currentTarget.dataset.r
        );

    const c =
        parseInt(
            event.currentTarget.dataset.c
        );

    if(
        selected === null &&
        boardState[r][c]
    ){

        selected = {r,c};

        drawBoard();

        return;
    }

    if(selected){

        const from =
            toCoord(
                selected.r,
                selected.c
            );

        const to =
            toCoord(r,c);

        if(
            from === puzzle.solution.from &&
            to === puzzle.solution.to
        ){

            solvePuzzle();

        }else{

            document.getElementById(
                "status"
            ).textContent =
                "❌ Movimiento incorrecto";

        }

        selected = null;

        drawBoard();
    }
}

function solvePuzzle(){

    document.getElementById(
        "status"
    ).textContent =
        "✅ Mate encontrado";

    document.getElementById(
        "success"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "coordinates"
    ).innerHTML = `
        <p>${puzzle.coordinates.lat}</p>
        <p>${puzzle.coordinates.lon}</p>

        <button onclick="copyCoords()">
            📋 Copiar coordenadas
        </button>
    `;
}

function copyCoords(){

    navigator.clipboard.writeText(
        `${puzzle.coordinates.lat}
${puzzle.coordinates.lon}`
    );

    alert(
        "Coordenadas copiadas"
    );
}

loadPuzzle();
