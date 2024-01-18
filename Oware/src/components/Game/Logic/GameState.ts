// gameState.ts
import { Seeds } from "./Seed";


export type GameState = {
    username:string;
    previouseHouse:string;
    nextHouse:string;
    onHand: Seeds;
    inPlay: Seeds;
    captured: Seeds;
    originalHouse:string;
    room:string

};

export const state: GameState = {
    username:"",
    room:"",
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

export const playersStates: PlayerState = {
    "player-1" : {
        username:"",
        room:"",
        previouseHouse:"",
        nextHouse:"house-6",
        onHand: [],
        inPlay: [],
        captured: [],
        originalHouse:"",
    },

    "player-2": {
        username:"",
        room:"",
        previouseHouse:"",
        nextHouse:"house-6",
        onHand: [],
        inPlay: [],
        captured: [],
        originalHouse:"",
    },
    
    
}