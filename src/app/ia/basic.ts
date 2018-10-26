import { Cell, FactoryCell } from "../models/cell.model";
import { GameLogic } from "../engine/logic";
import { Player } from "../models/player.model";
import { FactoryBoardCells } from "../models/board.model";

export class BasicIA {

    static play(board: Cell[], playerId: number, player: Player, halfCell: Cell): Cell {
        console.time('PLAY');

        let solutions = {};
        let playable = Array(board.length).fill(0);
        
        for(const cell of board) {
            if (halfCell != null) {
                //Playable cells are only living cells of the player
                if(GameLogic.isLivingCell(cell) && cell.player == playerId) {playable[cell.id] = 1;}    
            }
            else {
                //Playable cells are cells around living cells
                //IA can select empty cell if only it has enough cell to feed
                if(cell.player != GameLogic.NO_PLAYER) {
                    playable[cell.id] = 1;
                    const neighbors = GameLogic.getNeighbors(cell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
                    for(const neighbor of neighbors) {
                        if (((neighbor.state == GameLogic.EMPTY || neighbor.state == GameLogic.BORN) && player.score >= 2)
                        ||  (neighbor.state != GameLogic.EMPTY && neighbor.state != GameLogic.BORN)) {
                            playable[neighbor.id] = 1;
                        }
                    }
                }
            }
        }

        const nbPlayable = playable.length;
        let tmpPlayable = [];        
        for(let i = 0; i < nbPlayable; i++) {
            if(playable[i] == 1) {tmpPlayable.push(FactoryCell.copy(board[i]));}
        }
        playable = tmpPlayable;
        
        for(const cell of playable) {
            let tmpBoard = FactoryBoardCells.copy(board);            
            
            const updCell = GameLogic.updatePickedCell(cell, playerId, tmpBoard, 20);
            tmpBoard[updCell.id].state = updCell.state;
            tmpBoard[updCell.id].player = (updCell.state == GameLogic.EMPTY) ? GameLogic.NO_PLAYER : cell.player;

            const neighbors = GameLogic.getNeighbors(updCell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
            GameLogic.updatePickedNeighbors(neighbors, tmpBoard, 20);

            for (const neighbor of neighbors) {
                tmpBoard[neighbor.id].state = neighbor.state;
                tmpBoard[neighbor.id].player = neighbor.player;
            }
            
            if (GameLogic.isNewCell(tmpBoard[updCell.id])) {                
                for(let i = 0; i < 2; i++) {
                    const feedCellId = BasicIA.play(tmpBoard, playerId, player, updCell);
                    const updFeedCell = GameLogic.updatePickedCell(feedCellId, playerId, tmpBoard, 20);
                    tmpBoard[updFeedCell.id].state = updFeedCell.state;
                    tmpBoard[updFeedCell.id].player = updFeedCell.player;

                    const neighbors = GameLogic.getNeighbors(updFeedCell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
                    GameLogic.updatePickedNeighbors(neighbors, tmpBoard, 20);

                    for (const neighbor of neighbors) {
                        tmpBoard[neighbor.id].state = neighbor.state;
                        tmpBoard[neighbor.id].player = neighbor.player;
                    }
                }
            }

            tmpBoard = GameLogic.applyLife(tmpBoard);
            const scores = GameLogic.getScore(tmpBoard);
            solutions[cell.id] = scores[playerId] - scores[1-playerId];
        }

        let maxId = -1;
        let maxScore = Number.NEGATIVE_INFINITY;
        for(const i of Object.keys(solutions)) {
            if(solutions[i] > maxScore) {
                maxScore = solutions[i];
                maxId = parseInt(i);
            }
        }
        
        console.timeEnd('PLAY');

        return board[maxId];        
    }
}