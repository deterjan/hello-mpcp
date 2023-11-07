class MPCP {
    constructor(tm, blankSymbol) {
        this.tm = tm;
        this.top = [];
        this.bottom = [];
        this.blankSymbol = blankSymbol;

        this.tiles = this.makeTiles();
        this.candidates = []

        this.stepsSoFar = 0;


        // part 1
        this.top.push('#')
        this.bottom.push(...['#'].concat(tm.config()).concat(['#']))

    }

    display() {
        console.log('top: ', this.top, 'bottom: ', this.bottom);
    }

    done() {
        return this.top.join('') === this.bottom.join('')
    }

    makeTiles() {
        const t = [];
        let i = 0;

        Object.keys(delta).forEach(k => {
            Object.keys(delta[k]).forEach(ki => {
                const transition = delta[k][ki];

                const q = k;
                const r = transition[2];
                const a = ki;
                const b = transition[0];

                // part 2
                if (transition[1] === 'R') {
                    if (q !== 'qr') t.push(new Tile([q, a], [b, r], i++));
                }

                // part 3
                if (transition[1] === 'L') {
                    this.tm.tapeAlphabet.forEach(c => {
                        if (q !== 'qr') t.push(new Tile([c, q, a], [r, c, b], i++));
                    });
                }
            });
        });


        // part 4
        this.tm.tapeAlphabet.forEach(c => {
            t.push(new Tile([c],[c], i++));
        });

        // part 5
        t.push(new Tile(['#'],['#'], i++));
        t.push(new Tile(['#'],['_', '#'], i++));

        // part 6
        this.tm.tapeAlphabet.forEach(c => {
            t.push(new Tile([c, main.qAccept], [main.qAccept], i++));
            t.push(new Tile([c, main.qAccept], [main.qAccept]));
            t.push(new Tile([main.qAccept, c], [main.qAccept]));
        });

        // part 7
        t.push(new Tile([main.qAccept, '#', '#'], ['#'], i++));

        return t;
    }

    findCandidates() {
        let target = this.bottom.slice(this.top.length)

        if (this.bottom.join('').endsWith('qa##') && !this.bottom.join('').endsWith('#qa##')) {
            let finalPiece = this.tiles[this.tiles.length-1]
            this.candidates = [finalPiece]
        } else {
            this.candidates = this.tiles.filter(c => {
                let same = true;
                c.top.forEach((c, idx) => {
                    if (c !== target[idx]) same = false;
                });
                return same;
            });
        }
    }

    decideCandidate() {
        if (this.bottom.join('').endsWith('#qa#') && !this.bottom.join('').endsWith('#qa')) {
            console.log('bonk')
            let finalPiece =this.tiles[this.tiles.length-1]
            this.candidates = [finalPiece]
            this.candidate = finalPiece
        }
        else if (this.candidates.length === 0) {
            redraw()
            throw 'OOPS ' + this.stepsSoFar
        }
        else if (this.candidates.length === 1) this.candidate = this.candidates[0]
        else {
            const badSteps = [19, 118, 123, 124, 127, 135, 137]
            if (badSteps.includes(mpcp.stepsSoFar)) this.candidate = this.candidates[1]
            else this.candidate = this.candidates[0]
        }
    }

    step() {
        if (mpcp.bottom.join('').endsWith('#')) {
            mpcp.tm.step()
            updateDiagram(main.state)
        }

        if (this.done()) return;
        this.findCandidates();
        this.decideCandidate();

        this.top.push(...this.candidate.top)
        this.bottom.push(...this.candidate.bottom)
        this.stepsSoFar++;
        redraw()
    }


    displayTiles() {
        let div = document.getElementById('tiles')

        this.tiles.forEach((t) => {
            let table = document.createElement('table')
            table.id = t.idx;

            let tr0 = document.createElement('tr')
            table.appendChild(tr0)
            let tr1 = document.createElement('tr')
            table.appendChild(tr1)

            t.top.forEach(c => {
                let td0 = document.createElement('td')
                td0.innerText = `${c}`
                tr0.appendChild(td0)
            });

            t.bottom.forEach(c => {
                let td1 = document.createElement('td')
                td1.innerText = `${c}`
                tr1.appendChild(td1)
            });

            div.appendChild(table)
            table.addEventListener("click", () => {
                if (this.done()) return;

                if (mpcp.bottom.join('').endsWith('#'))
                    mpcp.tm.step()

                mpcp.top.push(...mpcp.tiles[parseInt(table.id)].top)
                mpcp.bottom.push(...mpcp.tiles[parseInt(table.id)].bottom)
                this.stepsSoFar++;

                this.findCandidates()
                this.decideCandidate()
                redraw()
            }, true);
        });
    }

    highlightCandidateTiles(can, color) {
        console.log(can)
        this.tiles.forEach(t => {
            document.getElementById('' + t.idx).style = "color: reset;"
        });

        can.forEach(c => {
            if (this.candidates.map(c=>c.idx).includes(c.idx))
                document.getElementById('' + c.idx).style = `color: ${color};`
        });

    }
}