import { Cell, FactoryCell } from "../models/cell.model";
import { GameLogic } from "../engine/logic";
import { Player } from "../models/player.model";
import { FactoryBoardCells } from "../models/board.model";

export class BasicIA {

    static play(board: Cell[], playerId: number, player: Player, halfCell: Cell): Cell {
        let solutions = {};
        let playable = [];
        
        for(const cell of board) {
            if (halfCell != null) {
                //Playable cells are only living cells of the player
                if(GameLogic.isLivingCell(cell) && cell.player == playerId) {playable.push(FactoryCell.copy(cell));}    
            }
            else {
                //Playable cells are cells around living cells
                //IA can select empty cell if only it has enough cell to feed
                if((cell.state == GameLogic.EMPTY || cell.state == GameLogic.BORN) 
                    && GameLogic.hasLivingCellAsNeighbor(cell, board)
                    && player.score >= 2){
                    playable.push(FactoryCell.copy(cell));
                }
                else if(GameLogic.isLivingCell(cell)) {
                    playable.push(FactoryCell.copy(cell));
                }
            }
        }

        for(const cell of playable) {
            let tmpBoard = FactoryBoardCells.copy(board);            
            
            const updCell = GameLogic.updatePickedCell(cell, playerId, tmpBoard, 20);
            tmpBoard[updCell.id].state = updCell.state;
            tmpBoard[updCell.id].player = updCell.player;
            //tmpBoard[updCell.id].player = (updCell.state == GameLogic.EMPTY) ? GameLogic.NO_PLAYER : cell.player;

            //const neighbors = GameLogic.getNeighbors(updCell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
            const neighbors = GameLogic.getNeighbors(updCell, tmpBoard, 20, GameLogic.MODE_ALL_NEIGHBORS);
            GameLogic.updatePickedNeighbors(neighbors, tmpBoard, 20);
            
            if (GameLogic.isNewCell(tmpBoard[updCell.id])) {
                for(let i = 0; i < 2; i++) {
                    const feedCellId = BasicIA.play(tmpBoard, playerId, player, updCell);
                    const updFeedCell = GameLogic.updatePickedCell(feedCellId, playerId, tmpBoard, 20);
                    tmpBoard[updFeedCell.id].state = updFeedCell.state;
                    tmpBoard[updFeedCell.id].player = updFeedCell.player;

                    //const neighbors = GameLogic.getNeighbors(updFeedCell, board, 20, GameLogic.MODE_ALL_NEIGHBORS);
                    const neighbors = GameLogic.getNeighbors(updFeedCell, tmpBoard, 20, GameLogic.MODE_ALL_NEIGHBORS);
                    GameLogic.updatePickedNeighbors(neighbors, tmpBoard, 20);
                }
            }

            //Apply life at the end of the IA turn
            //Do not apply life when selecting feeding cells
            if (halfCell == null) {
                tmpBoard = GameLogic.applyLife(tmpBoard);
            }
            
            const scores = GameLogic.getScore(tmpBoard);
            solutions[cell.id] = scores[playerId] - scores[1-playerId];
        }

        //let maxId = -1;
        let maxScore = Number.NEGATIVE_INFINITY;
        let allSolutions = [];
        for(const i of Object.keys(solutions)) {
            if(solutions[i] > maxScore) {
                maxScore = solutions[i];
                //maxId = parseInt(i);
                allSolutions = [parseInt(i)];
            }
            else if (solutions[i] == maxScore) {
                allSolutions.push(i);
            }
        }

        const randomId = Math.floor(Math.random() * allSolutions.length);
        return board[allSolutions[randomId]];
        //return board[maxId];        
    }
}