import { Channel, Message } from "./channel";

export class Agent {
    
    private subscriberMap = new Map<string, Function[]>();
    private executorMap = new Map<string, Function>();
    private name = 'Agent_' + Date.now();
    private buffer: [{
        type: string,
        name: string,
        data: any
    }] = [] as any;
    private isFlushing = false;

    constructor(private channel?: Channel) {
        this.setChannel(channel);
    }

    setChannel(channel?: Channel) {
        this.channel = channel;
        channel?.setListener((message: Message) => {
                if (message.type === 'call') {
                    const data = message.data[0];
                    const executor = this.executorMap.get(data.target);
                    if (executor) {
                        executor(data.args)
                            .then((result: any) => {
                                this.notify(message.name, 'event', result, false);
                            });
                    }
                } else {
                    const subscriptions = this.subscriberMap.get(message.name);
                    if (subscriptions && subscriptions.length > 0) {
                        subscriptions.forEach((s) => {
                            s(message.data);
                        });
                    }
                }
        });
    }

    invoke(target: string, args: any[], options = {
        timeout: 30000
    }) {
        return new Promise<any>((resolve, reject) => {
            const eventName = `call.${target}.${Date.now()}`;
            const destroy = this.subscribe(eventName, (data: any) => {
                resolve(data);
                destroy();
                clearTimeout(timeoutId);
            });
            const timeoutId = setTimeout(() => {
                destroy();
                reject(`No response in ${options.timeout} ms.`);
            }, options.timeout);
            this.notify(eventName, 'call', [{
                target: target,
                args: args
            }]);
        });
    }

    onInvoke(target: string, execute: (args: any[]) => Promise<any>) {
        this.executorMap.set(target, execute);
    }

    subscribe(event: string, callback: (args: any[]) => void) {
        let subscriptions = this.subscriberMap.get(event);
        if (!subscriptions) {
            subscriptions = [];
            this.subscriberMap.set(event, subscriptions);
        }
        subscriptions?.push(callback);
        return () => {
            let subscriptions = this.subscriberMap.get(event) || [];
            const i = subscriptions?.findIndex(c => c === callback);
            if (i >= 0) {
                delete subscriptions[i];
            }
        };
    }

    protected isFlushAllowed() {
        return true;
    }

    private processBuffer() {
        if (this.isFlushAllowed() && !this.isFlushing) {
            this.isFlushing = true;
            let n = this.buffer.shift();
            while(n) {
                this.channel?.send(n);
                n = this.buffer.shift();
            }
            this.isFlushing = false;
        }
    }

    private cleanRef(obj: any) {
        const seen = new WeakSet();
        return JSON.parse(JSON.stringify(obj, (k, v) => {
            if (typeof v === 'function')
                return;
            if (v !== null && typeof v === 'object') {
                if (seen.has(v)) return;
                seen.add(v);
            }
            return v;
        }));
    };

    notify(event: string, type: 'call' | 'event', args: any[], buffer = true) {
        args = this.cleanRef(args);
        if (buffer) {
            this.buffer.push({
                type: type,
                name: event,
                data: args
            });
            this.processBuffer();
        } else {
            this.channel?.send({
                type: type,
                name: event,
                data: args
            });
        }
    }

}