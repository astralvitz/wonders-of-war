export type GameAction = {
  type: 'ATTACK' | 'DEFEND' | 'EMPOWER' | 'ESPIONAGE';
  turnsRemaining: number;
  effect: {
    type: string;
    value: number;
    target?: 'PLAYER1' | 'PLAYER2';
  };
};

export type ActionsInProgress = {
  [actionId: string]: GameAction;
};

export interface BaseUser {
  id: string;
  twitterHandle?: string | null;
  eloRating: number;
}

export interface BaseWonder {
  id: number;
  name: string;
  description?: string | null;
}

export interface GameWithRelations {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  player1Id: string;
  player2Id: string;
  status: 'WAITING' | 'CHOOSING' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  winner?: string | null;
  player1WonderId: number;
  player2WonderId: number;
  player1Progress: number;
  player2Progress: number;
  currentTurn: string;
  actionsInProgress: ActionsInProgress;
  turns: number;
  player1: BaseUser;
  player2: BaseUser;
  player1Wonder: BaseWonder;
  player2Wonder: BaseWonder;
}

export interface GameState {
  player1Progress: number;
  player2Progress: number;
  currentTurn: string; // User ID
  actionsInProgress: ActionsInProgress;
  turns: number;
} 