let puzzle;
let board;

async function loadPuzzle() {

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

    await customElements.whenDefined(
        "chess-board"
    );

    board =
        document.getElementById("board");

    board.setAttribute(
        "position",
        puzzle.fen.split(" ")[0]
    );

    board.draggablePieces = true;

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

function resetBoard() {

    board.setPosition(
        puzzle.fen.split(" ")[0]
    );

    board.draggablePieces = true;
}

function handleMove(event) {

    const from =
        event.detail.source;

    const to =
        event.detail.target;

    const game =
        new Chess();

    game.load(
        puzzle.fen
    );

    const move =
        game.move({
            from: from,
            to: to,
            promotion: "q"
        });

    // Movimiento ilegal
    if (!move) {

        setTimeout(
            resetBoard,
            10
        );

        return;
    }

    // Compatible con ambos formatos
    const solved =
        typeof puzzle.solution === "string"

            ? move.san === puzzle.solution

            : (
                from === puzzle.solution.from &&
                to === puzzle.solution.to
            );

    if (solved) {

        solvePuzzle();

        return;
    }

    document.getElementById(
        "status"
    ).textContent =
        "❌ No es la solución";

    setTimeout(
        resetBoard,
        500
    );
}

function solvePuzzle() {

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

function copyCoords() {

    navigator.clipboard.writeText(
`${puzzle.coordinates.lat}
${puzzle.coordinates.lon}`
    );

    alert(
        "Coordenadas copiadas"
    );
}

window.onload = loadPuzzle;
