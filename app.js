let puzzle;

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

    const board =
        document.getElementById("board");

    await customElements.whenDefined(
        "chess-board"
    );

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

function handleMove(event) {

    const from = event.detail.source;
    const to = event.detail.target;

    console.log(
        from + " -> " + to
    );

    if (
        from === puzzle.solution.from &&
        to === puzzle.solution.to
    ) {

        solvePuzzle();

        return;
    }

    document.getElementById(
        "status"
    ).textContent =
        "❌ Movimiento incorrecto";
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
