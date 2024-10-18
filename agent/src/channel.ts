import { io, Socket } from 'socket.io-client'

export type Message = {
    channelId?: string,
    type: string;
    name: string;
    data: any[];
};

export interface Channel {

    send(message: Message): void;

    setListener(onMessage: (message: Message) => void): void;
}

export class WebSocketChannel implements Channel {

    private socket: Socket = null as any;
    private channelId: string = null as any;

    listener: (message: Message) => void = undefined as any;

    static connect({url, channelId}: {
        url: string,
        channelId: string,
    }) {
        return new WebSocketChannel({url, channelId});
    }

    private constructor({url, channelId}: {
        url: string,
        channelId: string,
    }) {
        this.socket = io(url);
        this.channelId = channelId;
        this.socket.emit('join', {channelId: channelId});
        this.socket.on('message', (message: Message) => {
            this.listener && this.listener(message);
        });
    }

    send(message: Message): void {
        this.socket.emit('message', {...message, channelId: this.channelId});
    }

    setListener(onMessage: (message: Message) => void) {
        this.listener = onMessage;
    }
}