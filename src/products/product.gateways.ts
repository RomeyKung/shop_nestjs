import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductGateWay {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer()
  private readonly server: Server;

  handleProductUpdate() {
    this.server.emit('productUpdated');
  }

  handleConnection(client: Socket) {
    try {
      this.authService.verifyToken(client.handshake.auth.Authentication.value);
    } catch (error) {
      throw new WsException('Unauthorized');
    }
  }
}
