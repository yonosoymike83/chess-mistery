let board;
let game;
let puzzle;

async function loadPuzzle() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("p") || "cache01";

    const response = await fetch(`puzzles/${id}.json`);

    puzzle = await response.json();

    document.getElementById("title").innerText =
        puzzle.title;

    document.getElementById("description").innerText =
        puzzle.description;

    game = new Chess(puzzle.fen);

    board = Chessboard("board", {
        draggable: true,
        position: puzzle.fen,
        onDrop: onDrop
    });
}

function onDrop(source, target) {

    const move = game.move({
        from: source,
        to: target,
        promotion: "q"
    });

    if (move === null) {
        return "snapback";
    }

    if (
        source === puzzle.solution.from &&
        target === puzzle.solution.to
    ) {

        showCoordinates();

    } else {

        document.getElementById("status").innerText =
            "❌ Movimiento incorrecto";

        setTimeout(() => {

            game = new Chess(puzzle.fen);

            board.position(puzzle.fen);

            document.getElementById("status").innerText =
                "Pendiente";

        }, 1500);
    }
}

function showCoordinates() {

    document.getElementById("status").innerText =
        "✅ Correcto";

    document.getElementById("success")
        .classList.remove("hidden");

    document.getElementById("coordinates").innerHTML = `
        <p>${puzzle.coordinates.lat}</p>
        <p>${puzzle.coordinates.lon}</p>
    `;
}

loadPuzzle();
