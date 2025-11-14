export interface VotePackage {
  id: string;
  name: string;
  items: string[];
}

export interface User {
  userId: string;
  name: string;
  isOwner: boolean;
  role: 'Player' | 'Spectator';
  hasVoted: boolean;
  vote: string | null;
}

export interface RoomState {
  roomId: string;
  roomName: string;
  votePackage: VotePackage;
  areCardsRevealed: boolean;
  users: User[];
}

export interface VoteSubmittedEvent {
  userName: string;
  voteValue: string;
  vote: any;
}

export interface RoomDestroyedEvent {
  roomId: string;
}

export interface OwnerToggledEvent {
  roomId: string;
  newOwnerUserName: string;
}

export interface RoleChangedEvent {
  roomId: string;
  userName: string;
}