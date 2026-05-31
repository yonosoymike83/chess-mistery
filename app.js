let puzzle;
let game;

async function loadPuzzle(){

    const id =
        new URLSearchParams(location.search)
        .get("p") || "cache01";

    puzzle =
        await (
            await fetch(
                `puzzles/${id}.json`
            )
        ).json();

    document.getElementById("title")
        .textContent =
        puzzle.title;

    document.getElementById("description")
        .textContent =
        puzzle.description;

    game = new Chess(puzzle.fen);

    const board =
        document.getElementById("board");

    board.setPosition(
        game.fen()
    );

    board.addEventListener(
        "drop",
        handleMove
    );

    document
        .getElementById("copyBtn")
        .addEventListener(
            "click",
            copyCoords
        );
}

function handleMove(event){

    const move = game.move({
        from:event.detail.source,
        to:event.detail.target,
        promotion:"q"
    });

    if(!move){

        event.preventDefault();

        return;
    }

    const san = move.san;

    if(
        san === puzzle.solution
    ){

        solvePuzzle();

        return;
    }

    document.getElementById(
        "status"
    ).textContent =
        "❌ Movimiento incorrecto";

    setTimeout(()=>{

        game = new Chess(
            puzzle.fen
        );

        document
            .getElementById("board")
            .setPosition(
                game.fen()
            );

        document.getElementById(
            "status"
        ).textContent =
            "Pendiente";

    },1000);
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
