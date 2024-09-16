import { io, Socket } from 'socket.io-client'

export type Message = {
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

    listener: (message: Message) => void = undefined as any;

    static connect({url}: {
        url: string
    }) {
        return new WebSocketChannel({url});
    }

    private constructor({url}: {
        url: string
    }) {
        this.socket = io(url);
        this.socket.on('message', (message: Message) => {
            this.listener && this.listener(message);
        })
    }

    send(message: Message): void {
        this.socket.emit('message', message);
    }

    setListener(onMessage: (message: Message) => void) {
        this.listener = onMessage;
    }
}