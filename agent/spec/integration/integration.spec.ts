import { Agent } from '../../src/agent';
import { WebSocketChannel } from '../../src/channel';

describe('system-test', () => {
    // server needs to be up.
    it('test with multi-agents', async () => {
        const agent1 = new Agent(WebSocketChannel.connect({
            url: 'ws://localhost:3000',
            channelId: 'random'
        }));
        const agent2 = new Agent(WebSocketChannel.connect({
            url: 'ws://localhost:3000',
            channelId: 'random'
        }));
        const agent3 = new Agent(WebSocketChannel.connect({
            url: 'ws://localhost:3000',
            channelId: 'random1'
        }));
        const o = {
            listener: ([{message, from}]: any[]) => {
                return Promise.resolve({
                    message: 'Hello Agent1', 
                    from: 'Agent2'
                });
            }
        };
        const o1 = {
            listener: ([{message, from}]: any[]) => {
                throw new Error('should not be called');
            }
        };
        spyOn(o, 'listener').and.callThrough();
        agent2.onInvoke('sayHello', o.listener);
        spyOn(o1, 'listener').and.callThrough();
        agent3.onInvoke('sayHello', o1.listener);
        const result = await agent1.invoke('sayHello', [{
            message: 'Hello Agent2', 
            from: 'Agent1'
        }]);
        expect(o.listener).toHaveBeenCalledOnceWith([{
            message: 'Hello Agent2', 
            from: 'Agent1'
        }]);
        expect(o1.listener).not.toHaveBeenCalled();
        expect(result.message).toEqual('Hello Agent1');
        expect(result.from).toEqual('Agent2');
    })
});