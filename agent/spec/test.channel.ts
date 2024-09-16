import { Channel, Message } from "../src";

class TestChannel implements Channel {
    public name = 'agent1';
    public other: TestChannel = null as any;
    
    listener: (message: Message) => void = () => {};

    send(message: Message): void {
        Promise.resolve()
            .then(() => this.other.listener(message));
    }

    setListener(listener: (message: Message) => void): void {
        this.listener = listener;
    }
}

export const getTestChannel = () => {
    const testChannel = new TestChannel();
    testChannel.other = new TestChannel();
    testChannel.other.other = testChannel;
    testChannel.name = "agent1";
    testChannel.other.name = "agent2";
    return testChannel;
};