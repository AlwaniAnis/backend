import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // You can restrict this to specific frontend origins
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, { socketId: string; roles: string[] }>(); // userId -> { socketId, roles }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const rolesRaw = client.handshake.query.roles as string;
    const roles = rolesRaw?.split(',') || [];
    if (userId) {
      this.clients.set(userId, { socketId: client.id, roles });
      console.log(`User ${userId} connected with roles: ${roles}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.clients.entries()) {
      if (socketId.socketId === client.id) {
        this.clients.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  sendToUser(userId: string, message: string) {
    const socketId = this.clients.get(userId);
    if (socketId) {
      this.server.to(socketId.socketId).emit('statusUpdate', message);
    }
  }
  sendToAdmins(message: string) {
    console.log('Sending message to admins:', message);
    for (const { socketId, roles } of this.clients.values()) {
      if (roles.includes('admin')) {
        this.server.to(socketId).emit('statusUpdate', message);
      }
    }
  }
}
