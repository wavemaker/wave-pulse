"use client";
import { Agent, Channel, WebSocketChannel } from '@wavemaker/wavepulse-agent';
import { CALLS } from '@/wavepulse/constants';
import axios from 'axios';
import { Subject } from 'rxjs';

const WAVEPULSE_SESSION_DATA = 'wavepulse:session_data';

export class UIAgent extends Agent {

    private connectionSubject = new Subject();
    private _isConnected = false;
    private _sessionData = {} as any;
    private _currentSessionData = {} as any;
    private _sessionDataKey = '';

    constructor(private wsurl: string,
        private httpurl: string,
        public channelId: string,
        private localStorage: Storage,
        sessionDataKey?: string,) {
        sessionDataKey = sessionDataKey || localStorage.getItem(WAVEPULSE_SESSION_DATA) || '';
        super(sessionDataKey ? {
            send: () => {},
            setListener: () => {}
        } as Channel: WebSocketChannel.connect({
            url: wsurl,
            path: '/wavepulse/socket.io',
            channelId: channelId
        }));
        if (!sessionDataKey) {
            this.checkForWavePulseAgent();
        };
        this._sessionDataKey = sessionDataKey || '';
    }

    get sessionData() {
        return this._sessionData;
    }

    get currentSessionData() {
        return this._currentSessionData;
    }

    get sessionDataKey() {
        return this._sessionDataKey;
    }

    set sessionDataKey(k: string) {
        if (k) {
            this.localStorage.setItem(WAVEPULSE_SESSION_DATA, k);
        } else {
            this.localStorage.removeItem(WAVEPULSE_SESSION_DATA);
        }
        if (this.sessionDataKey !== k) {
            setTimeout(() => window.location.reload(), 100);
        }
    }

    private async checkForWavePulseAgent() {
        try {
            await this.invoke(CALLS.HANDSHAKE.WISH, [], {
                timeout: 2000
            });
            this._isConnected = true;
            this.connectionSubject.next(this.isConnected);
        } catch(e) {
            this.checkForWavePulseAgent();
        }
    }

    get isConnected() {
        return this._isConnected && !this.sessionDataKey;
    }

    public onConnect(callback : Function) {
        if (this.isConnected) {
            callback();
        }
        const destroy = this.connectionSubject.subscribe(() => {
            if(this.isConnected) {
                callback();
                destroy.unsubscribe();
            }
        });
    }

    public getWavepulseUrl({appId, expoUrl} : {appId?: string, expoUrl?: string}) {
        if (appId) {
            return axios.get(`${this.httpurl}/api/service/url?appId=${appId}&channelId=${this.channelId}`).then(res => res.data);
        } else if(expoUrl) {
            return axios.get(`${this.httpurl}/api/service/url?expoUrl=${expoUrl}&channelId=${this.channelId}`).then(res => res.data);
        }
        return Promise.resolve('');
    }

    exportSessionData(name: string) {
        name = name + '.wavepulse';
        const form = new FormData();
        form.append('filename', name);
        const entries = [] as any;
        Object.keys(this.currentSessionData).forEach((k: string) => {
            form.append(k, JSON.stringify(this.currentSessionData[k]));
            entries.push(k);
        });
        form.append('entries', JSON.stringify(entries));
        return axios.post(`${this.httpurl}/api/session/data/export`, form,  {
            headers: {
                'Content-Type': 'multipart/form'
            }
        }).then(res => {
            window.location.href = `${this.httpurl}/api/session/data/${res.data.path}?name=${name}.zip`;
        });
    }

    importSessionData(file: any) {
        const formData = new FormData();
        formData.append("file", file);
        return axios.post(`${this.httpurl}/api/session/data/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form'
            }
        }).then((res) => {
            this._sessionData = {...res.data};
            this._sessionDataKey = file.name;
        });
    }
}