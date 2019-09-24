const boardWidth = 5;

class POS {
    constructor(x = null, y = null) {
        this.x = x;
        this.y = y;
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
    }

    nullXY() {
        this.x = null;
        this.y = null;
    }

    z() {
        return -(x+y);
    }

    roundedPos() {
        return new POS(Math.round(this.x), Math.round(this.y));
    }

    rotateCW() {
        let newX = -this.z();
        this.y = -this.x;
        this.x = newX;
    }

    rotateCCW() {
        let newY = -this.z()
        this.x = -this.y;
        this.y = newY;
    }
    
    validPBoardPos() {
        return (-5 <= this.y && this.y <= -3
            && 0 <= this.x && this.x <= 4
            && this.x + this.y <= -1);     
    }

    validBBoardPos() {
        return (-boardWidth <= this.x && this.x <= boardWidth 
            && -boardWidth <= this.y && this.y <= boardWidth
            && Math.abs(this.x + this.y) <= boardWidth);
    }
}

function validPBoardPos(x, y) {
    return (-5 <= y && y <= -3
        && 0 <= x && x <= 4
        && x + y <= -1);
}

function validBBoardPos(x, y) {
    return (-boardWidth <= x && x <= boardWidth 
        && -boardWidth <= y && y <= boardWidth
        && Math.abs(x + y) <= boardWidth);
}

module.exports = {
    POS,
    validPBoardPos,
    validBBoardPos,
    boardWidth
}