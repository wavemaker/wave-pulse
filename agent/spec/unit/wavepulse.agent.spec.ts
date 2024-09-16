import { Agent } from '../../src';
import { createWavePulseAgent } from '../../src/wavepulse.agent';
import { EVENTS } from '../../src/constants';
import { getTestChannel } from '../test.channel';

describe('Test WavePulse Agent', () => {
    let agent: Agent, proxyAgent: Agent;
    beforeAll(() => {
        const testChannel = getTestChannel();
        agent = new Agent(testChannel);
        proxyAgent = new Agent(testChannel.other);
        createWavePulseAgent({
            handler: {
                subscribe: (event: string, callback: (...args: any) => any) => {

                }
            },
            agent: agent
        })
    });

    it('Check console logs', async () => {
        let log = 0, warn = 0, error = 0, debug = 0, info = 0;
        proxyAgent.subscribe(EVENTS.CONSOLE.LOG, (args) => {
            const o = args[0];
            if (o.type === 'log') {
                log++;
                expect(o.message[0]).toBe('test log');
            } else if (o.type == 'warn') {
                warn++;
                expect(o.message[0]).toBe('test warn');
            } else if (o.type == 'error') {
                error++;
                expect(o.message[0]).toBe('test error');
            } else if (o.type == 'debug') {
                debug++
                expect(o.message[0]).toBe('test debug');
            } else if (o.type == 'info') {
                info++
                expect(o.message[0]).toBe('test info');
            }
        });
        console.log('test log');
        console.error('test error');
        console.debug('test debug');
        console.warn('test warn');
        console.info('test info');
        await new Promise((res) => setTimeout(res, 1000));
        expect(log).toBe(1);
        expect(warn).toBe(1);
        expect(info).toBe(1);
        expect(debug).toBe(1);
        expect(error).toBe(1);
    });
});