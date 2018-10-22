import { IA } from "./ia";
import { Cell, FactoryCell } from "../models/cell.model";
import { GameLogic } from "../engine/logic";

export class BasicIA implements IA {
    playerId: number;

    play(board: Cell[]): Cell {
        let solutions = {};

        let playable = Array(board.length).fill(0);
        for(const cell of board) {
            if(cell.player != GameLogic.NO_PLAYER) {
                playable[cell.id] = 1;
                const neighbors = GameLogic.getNeighbors(cell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
                for(const neighbor of neighbors) {
                    playable[neighbor.id] = 1;   
                }
            }
        }

        for(const cell of playable) {
            let tmpBoard = board.map(c => FactoryCell.copy(c));
            
            const updCell = GameLogic.updatePickedCell(cell, this.playerId, tmpBoard, 20);
            tmpBoard[updCell.id].state = updCell.state;
            tmpBoard[updCell.id].player = (updCell.state == GameLogic.EMPTY) ? GameLogic.NO_PLAYER : cell.player;

            const neighbors = GameLogic.getNeighbors(updCell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
            GameLogic.updatePickedNeighbors(neighbors, tmpBoard, 20);

            for (const neighbor of neighbors) {
                tmpBoard[neighbor.id].state = neighbor.state;
                tmpBoard[neighbor.id].player = neighbor.player;
            }

            const scores = GameLogic.getScore(tmpBoard);
            solutions[cell.id] = scores[this.playerId] - scores[1-this.playerId];
        }

        let maxId = -1;
        let maxScore = 0;
        for(const i of Object.keys(solutions)) {
            if(solutions[i] > maxScore) {
                maxScore = solutions[i];
                maxId = parseInt(i);
            }
        }
        
        return board[maxId];
    }
}