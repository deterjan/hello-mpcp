class Tape {
    constructor(w, blankSymbol) {
        this.content = w;
        this.blankSymbol = blankSymbol;
        this.head = 0;
    }

    right(newChar) {
        if (this.head === this.content.length - 1)
            this.content.push(this.blankSymbol);
        this.content[this.head] = newChar;
        this.head++;
    }

    left(newChar) {
        if (this.head === 0) throw "Head at 0, can't go left";
        this.content[this.head] = newChar;
        this.head--;
    }

    read() {
        return this.content[this.head];
    }
}

class SingleTapeTM {
    constructor(
        q,
        tapeAlphabet,
        blankSymbol,
        startState,
        qAccept,
        qReject,
        w,
        delta) {
        this.q = q;
        this.tapeAlphabet = tapeAlphabet;
        this.qAccept = qAccept;
        this.qReject = qReject;

        this.state = startState;
        this.tape = new Tape(w, blankSymbol);
        this.delta = delta;
    }

    done() {
        return qAccept === this.state || qReject === this.state;
    }

    step(debug) {
        if (!this.done()) {
            const transition = this.delta[this.state][this.tape.read()];
            const write = transition[0];
            const move = transition[1];
            const nextState = transition[2];

            const oldSym = this.tape.read();
            if (move === 'L') this.tape.left(write);
            if (move === 'R') this.tape.right(write);
            const newSym = this.tape.read();

            const oldState = this.state;
            this.state = nextState;

            if (debug) console.log(this.configString());

            return {
                'q': oldState,
                'r': nextState,
                'a': oldSym,
                'b': newSym
            };
        }
        return undefined;
    }

    run(debug) {
        if (debug) console.log(this.configString());
        while (!this.done()) this.step(debug);
    }

    config() {
        let ncontent = JSON.parse(JSON.stringify(this.tape.content));
        ncontent.splice(this.tape.head, 0, this.state);

        while (ncontent[ncontent.length - 1] === blankSymbol) ncontent.pop();
        return ncontent;
    }

    configString() {
        let ncontent = JSON.parse(JSON.stringify(this.tape.content));
        ncontent.splice(this.tape.head, 0, `(${this.state})`);

        return ncontent.join('');
    }
}