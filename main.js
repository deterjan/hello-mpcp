function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const q = ['q1', 'q2', 'q3', 'q4', 'q5', 'qa', 'qr'];
const tapeAlphabet = ['0', 'x', '_'];
const blankSymbol = '_';
const startState = 'q1';
const qAccept = 'qa';
const qReject = 'qr';

const delta = {
    'q1': {
        '0': ['_', 'R', 'q2'],
        '_': ['_', 'R', 'qr'],
        'x': ['x', 'R', 'qr']
    },

    'q2': {
        '0': ['x', 'R', 'q3'],
        '_': ['_', 'R', 'qa'],
        'x': ['x', 'R', 'q2']
    },

    'q3': {
        '0': ['0', 'R', 'q4'],
        '_': ['_', 'L', 'q5'],
        'x': ['x', 'R', 'q3']
    },

    'q4': {
        '0': ['x', 'R', 'q3'],
        '_': ['_', 'R', 'qr'],
        'x': ['x', 'R', 'q4']
    },

    'q5': {
        '0': ['0', 'L', 'q5'],
        '_': ['_', 'R', 'q2'],
        'x': ['x', 'L', 'q5']
    }
}

function displayTable(tableId, content, head) {
    let row = document.getElementById(tableId)

    row.innerText = ''
    content.forEach((x, i) => {
        let td = document.createElement('td');
        td.innerText = x
        if (i === head) {
            td.style.backgroundColor = 'green'
        }

        row.appendChild(td)
    });
}

let main = new SingleTapeTM(
    q,
    tapeAlphabet,
    blankSymbol,
    startState,
    qAccept,
    qReject,
    ['0', '0', '0', '0',blankSymbol,blankSymbol],
    delta
);

let mpcp = new MPCP(main, blankSymbol);

displayTable('tm', main.tape.content, main.tape.head)
displayTable('mpcptop', mpcp.top)
displayTable('mpcpbottom', mpcp.bottom)

function scrollTableRight() {
    let tableElem = document.getElementById('tableContainer')
    tableElem.scrollTo({
        top: 0,
        left: tableElem.scrollWidth,
        behavior: "smooth",
    });
}

function redraw() {
    document.getElementById('mpcpsteps').innerText = `steps: ${mpcp.stepsSoFar}`
    displayTable('tm', main.tape.content, main.tape.head)
    displayTable('mpcptop', mpcp.top)
    displayTable('mpcpbottom', mpcp.bottom)

    mpcp.highlightCandidateTiles(mpcp.candidates, 'orange')

    scrollTableRight()
}

function stepButton() {
    mpcp.step();
}

function updateDiagram(state) {
    let qs = document.querySelectorAll("[id^=\'q\']")
    qs.forEach(q => {
        q.children[2].setAttribute('fill', 'white')
    })

    document.getElementById(state).children[2].setAttribute('fill', 'green')
}

async function runButton(t1, t2) {
    while (!mpcp.done()) {
        stepButton()
        mpcp.highlightCandidateTiles(mpcp.candidates, 'orange')
        await sleep(t1)
        mpcp.highlightCandidateTiles([mpcp.candidate], 'green')
        await sleep(t2)
    }
}
mpcp.displayTiles()
mpcp.findCandidates()
mpcp.highlightCandidateTiles(mpcp.candidates, 'orange')
updateDiagram('q1')