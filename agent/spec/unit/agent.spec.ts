import { Agent } from '../../src';
import { getTestChannel } from '../test.channel';

describe('basic functionality', () => {
    it('Invoke other agent', async () => {
        const testChannel = getTestChannel();
        const agent1 = new Agent(testChannel);
        const agent2 = new Agent(testChannel.other);
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
    });

    it('Invoke other agent for timeout scenario', async () => {
        const testChannel = getTestChannel();
        const agent1 = new Agent(testChannel);
        const agent2 = new Agent(testChannel.other);
        const o = {
            listener: ([{message, from}]: any[]) => {
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, 20000);
                });
            }
        };
        agent2.onInvoke('sayHello', o.listener);
        const result1 = await agent1.invoke('sayHello', [{
            message: 'Hello Agent2', 
            from: 'Agent1'
        }], {
            timeout: 1000
        }).catch((msg: any) => msg);
        expect(result1).toEqual('No response in 1000 ms.');
    });

    it('subscribe events', async () => {
        const testChannel = getTestChannel();
        const agent1 = new Agent(testChannel);
        const agent2 = new Agent(testChannel.other);
        const o = {
            subscribe: (args: any[]) => {

            }
        };
        spyOn(o, 'subscribe');
        agent1.subscribe('my-event', o.subscribe);
        agent2.notify('my-event', 'event', ['first', 'second']);
        await new Promise(resolve => setTimeout(resolve, 2000));
        expect(o.subscribe).toHaveBeenCalledWith(['first', 'second']);
    });
});