// gameState.ts
import { Seeds } from "./Seed";


export type GameState = {
    previouseHouse:string;
    nextHouse:string;
    onHand: Seeds;
    inPlay: Seeds;
    captured: Seeds;
    originalHouse:string;

};

export const state: GameState = {
    previouseHouse:"",
    nextHouse:"house-6",
    onHand: [],
    inPlay: [],
    captured: [],
    originalHouse:"",
};

export interface PlayerState{
    [key: string] : GameState;
}

export const playes: PlayerState = {
    "player-1" : {
        previouseHouse:"",
        nextHouse:"house-6",
        onHand: [],
        inPlay: [],
        captured: [],
        originalHouse:"",
    },

    "player-2": {
        previouseHouse:"",
        nextHouse:"house-6",
        onHand: [],
        inPlay: [],
        captured: [],
        originalHouse:"",
    },
    
    
}