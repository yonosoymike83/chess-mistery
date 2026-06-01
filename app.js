let puzzle;
let board;

let language =
    localStorage.getItem("language");

if (!language) {

    const browserLang =
        navigator.language.toLowerCase();

    if (browserLang.startsWith("ca")) {

        language = "ca";

    } else if (browserLang.startsWith("en")) {

        language = "en";

    } else {

        language = "es";
    }
}

const translations = {

    es: {
        pending: "Pendiente",
        wrong: "❌ No es la solución",
        copied: "Coordenadas copiadas",
        solvedTitle: "✅ Puzzle resuelto"
    },

    ca: {
        pending: "Pendent",
        wrong: "❌ No és la solució",
        copied: "Coordenades copiades",
        solvedTitle: "✅ Trencaclosques resolt"
    },

    en: {
        pending: "Pending",
        wrong: "❌ Not the solution",
        copied: "Coordinates copied",
        solvedTitle: "✅ Puzzle solved"
    }
};

function t(key) {

    return translations[language][key];
}

function setLanguage(lang) {

    localStorage.setItem(
        "language",
        lang
    );

    location.reload();
}

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
        puzzle.title[language];

    document.getElementById("description")
        .textContent =
        puzzle.description[language];

    document.getElementById("status")
        .textContent =
        t("pending");

    const solvedTitle =
        document.querySelector("#success h2");

    if (solvedTitle) {

        solvedTitle.textContent =
            t("solvedTitle");
    }

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

    // Compatible con SAN y formato antiguo
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
        t("wrong");

    setTimeout(
        resetBoard,
        500
    );
}

function solvePuzzle() {

    document.getElementById(
        "status"
    ).style.display =
        "none";

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
        t("copied")
    );
}

window.onload = loadPuzzle;
