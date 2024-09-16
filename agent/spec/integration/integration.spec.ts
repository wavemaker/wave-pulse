import { Agent } from '../../src/agent';
import { WebSocketChannel } from '../../src/channel';

xdescribe('system-test', () => {
    // server needs to be up.
    it('test with agents', async () => {
        const agent1 = new Agent(WebSocketChannel.connect({
            url: 'ws://localhost:3333'
        }));
        const agent2 = new Agent(WebSocketChannel.connect({
            url: 'ws://localhost:3333'
        }));
        const o = {
            listener: ([{message, from}]: any[]) => {
                return Promise.resolve({
                    message: 'Hello Agent1', 
                    from: 'Agent2'
                });
            }
        };
        spyOn(o, 'listener').and.callThrough();
        agent2.onInvoke('sayHello', o.listener);
        const result = await agent1.invoke('sayHello', [{
            message: 'Hello Agent2', 
            from: 'Agent1'
        }]);
        expect(o.listener).toHaveBeenCalledOnceWith([{
            message: 'Hello Agent2', 
            from: 'Agent1'
        }]);
        expect(result.message).toEqual('Hello Agent1');
        expect(result.from).toEqual('Agent2');
    })
});