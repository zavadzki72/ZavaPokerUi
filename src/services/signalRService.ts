import * as signalR from '@microsoft/signalr';
import { VotePackage, RoomState } from '../types';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('✅ SignalR: Already connected');
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7299/zava-hub', {
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();

    try {
      await this.connection.start();
      console.log('✅ SignalR: Connection established successfully');
    } catch (error) {
      console.error('❌ SignalR: Connection failed', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    // Handle reconnection
    this.connection.onreconnecting((error) => {
      console.warn('⚠️ SignalR: Reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('✅ SignalR: Reconnected', connectionId);
    });

    this.connection.onclose((error) => {
      console.error('❌ SignalR: Connection closed', error);
    });

    // Setup event listeners
    this.connection.on('UpdateUserList', (data: string) => {
      console.log('📥 SignalR Event: UpdateUserList', data);
      const parsed = JSON.parse(data) as RoomState;
      this.emit('UpdateUserList', parsed);
    });

    this.connection.on('VoteSubmitted', (data: string) => {
      console.log('📥 SignalR Event: VoteSubmitted', data);
      this.emit('VoteSubmitted', JSON.parse(data));
    });

    this.connection.on('RoomDestroyed', (data: string) => {
      console.log('📥 SignalR Event: RoomDestroyed', data);
      this.emit('RoomDestroyed', JSON.parse(data));
    });

    this.connection.on('OwnerToggled', (data: string) => {
      console.log('📥 SignalR Event: OwnerToggled', data);
      this.emit('OwnerToggled', JSON.parse(data));
    });

    this.connection.on('RoleChanged', (data: string) => {
      console.log('📥 SignalR Event: RoleChanged', data);
      this.emit('RoleChanged', JSON.parse(data));
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log('🔌 SignalR: Disconnected');
    }
  }

  // Event subscription
  on(eventName: string, callback: (data: any) => void): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(callback);
  }

  off(eventName: string, callback: (data: any) => void): void {
    this.listeners.get(eventName)?.delete(callback);
  }

  private emit(eventName: string, data: any): void {
    this.listeners.get(eventName)?.forEach(callback => callback(data));
  }

  // API Methods
  async getVotePackages(): Promise<VotePackage[]> {
    console.log('📤 SignalR: GetVotePackages');
    if (!this.connection) throw new Error('Not connected');
    return await this.connection.invoke('GetVotePackages');
  }

  async createRoom(roomName: string, votePackageId: string, userName: string): Promise<string> {
    console.log('📤 SignalR: CreateRoom', { roomName, votePackageId, userName });
    if (!this.connection) throw new Error('Not connected');
    return await this.connection.invoke('CreateRoom', roomName, votePackageId, userName);
  }

  async joinRoom(roomId: string, userName: string): Promise<void> {
    console.log('📤 SignalR: JoinRoom', { roomId, userName });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('JoinRoom', roomId, userName);
  }

  async leaveRoom(userName: string): Promise<void> {
    console.log('📤 SignalR: LeaveRoom', { userName });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('LeaveRoom', userName);
  }

  async startRound(roomId: string): Promise<void> {
    console.log('📤 SignalR: StartRound', { roomId });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('StartRound', roomId);
  }

  async submitVote(userName: string, voteValue: string): Promise<void> {
    console.log('📤 SignalR: SubmitVote', { userName, voteValue });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('SubmitVote', userName, voteValue);
  }

  async revealCards(roomId: string): Promise<void> {
    console.log('📤 SignalR: RevealCards', { roomId });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('RevealCards', roomId);
  }

  async destroyRoom(roomId: string): Promise<void> {
    console.log('📤 SignalR: DestroyRoom', { roomId });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('DestroyRoom', roomId);
  }

  async toggleOwner(roomId: string, newOwnerUserName: string): Promise<void> {
    console.log('📤 SignalR: ToggleOwner', { roomId, newOwnerUserName });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('ToggleOwner', roomId, newOwnerUserName);
  }

  async changeRole(roomId: string, userName: string): Promise<void> {
    console.log('📤 SignalR: ChangeRole', { roomId, userName });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('ChangeRole', roomId, userName);
  }

  async changeVotePackage(roomId: string, votePackageId: string): Promise<void> {
    console.log('📤 SignalR: ChangeVotePackage', { roomId, votePackageId });
    if (!this.connection) throw new Error('Not connected');
    await this.connection.invoke('ChangeVotePackage', roomId, votePackageId);
  }

  async getRoomState(roomId: string): Promise<RoomState> {
    console.log('📤 SignalR: GetUsersInRoom', { roomId });
    if (!this.connection) throw new Error('Not connected');
    return await this.connection.invoke('GetUsersInRoom', roomId);
  }
}

export const signalRService = new SignalRService();