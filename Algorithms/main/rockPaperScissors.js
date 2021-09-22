/**
 * A simple Rock paper scissors game between a player and computer
 * 
 */

const readline = require('readline');
const helpers = require('../Utilities/helpers')

const container = {};

container.init = () => {
    const NUMBEROFROUNDS = 5
    let round = 0;
    let roundResult = {
        playerScore: 0,
        computerScore: 0
    };

    const moves = {
        1: 'r',
        2: 'p',
        3: 's',
        r: true,
        p: true,
        s: true,
    }

    const readline =  container.createReadlineInterface();

    readline.prompt();

    readline.on('line', userMove => {
        
        userMove = container.moveValidator(userMove, moves);    
        if (userMove) {
            roundResult = container.processMove(userMove, moves, roundResult);
            //TODO remove this
            console.log('RoundResult', roundResult);
            // console.log('\n');
            container.displayWinnerMessage(roundResult);
            round++ 
        } else {
            console.log('Invalid move');
        }
        
        if (round >= NUMBEROFROUNDS) readline.close();
        console.log('=======================================================================');
        readline.prompt();
    });
    
    
    readline.on('close', () => {
        container.displayWinnerMessage(roundResult, true);
        process.exit(1);
    });
}

container.createReadlineInterface = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Player: ' 
    });
}

container.moveValidator = (move='', moves) => {
    return typeof(move) === 'string' && move.length > 0 && moves[move.toLowerCase()] ? move.toLowerCase() : false;
}

container.processMove = (userMove, moves, roundResult) => {
    let computerMove = container.getComputerMove(moves);
    //TODO remove
    console.log('Computer: '+computerMove+'\n');
    return userMove !== computerMove ? container.scoreKeeper(true, false, roundResult) : container.scoreKeeper(false, true, roundResult);
}

container.getComputerMove = (moves) => {
    let randNumber = helpers.randomNumberGenerator(3);
    return moves[randNumber];
}

container.scoreKeeper = (updatePlayer, updateComputer, roundResult) => {
    if (updatePlayer) {
        roundResult.winner = 'player'
        roundResult.playerScore++;
    }
    
    if (updateComputer) {
        roundResult.winner = 'computer'
        roundResult.computerScore++;
    }

    return roundResult;
}

container.displayWinnerMessage = (roundResult, lastRound) => {
    if (roundResult.winner === 'player' && !lastRound) {
        console.log('You won this round\n');
    } else if (roundResult.winner === 'player' && lastRound){
        console.log('You are the winner of the competition!!!\n');
    } else if (roundResult.winner === 'computer' && !lastRound){
        console.log('You lost this round\n');
    } else if (roundResult.winner === 'computer' && lastRound){
        console.log('Sorry you lost in the competition, please try again\n');
    } 
}

container.init()


//export the module
module.exports = container;
