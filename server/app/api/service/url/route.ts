import { NextRequest } from 'next/server';
import os from 'os';

function getIpAddress() {
    var interfaces = os.networkInterfaces();
    for(var key in interfaces) {
        var addresses = interfaces[key];
        if (addresses) {
            for(var i = 0; i < addresses.length; i++) {
                var address = addresses[i];
                if(!address.internal && address.family === 'IPv4') {
                    return address.address;
                };
            };
        }
    };
    return 'localhost';
}
const BASE_URL = process.env.WAVEPULSE_BASE_URL || `http://${getIpAddress()}:3000`;
export async function GET(
    request: NextRequest
  ) {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get('appId');
    const expoUrl = searchParams.get('expoUrl');
    const channelId = searchParams.get('channelId');
    if (appId) {
        return new Response(`${BASE_URL}/api/connect?channelId=${channelId}&appId=${appId}&wavepulseURL=${BASE_URL}`, {
            status: 200
        });
    }
    if (expoUrl) {
        return new Response(`${BASE_URL}/api/connect?channelId=${channelId}&expoUrl=${expoUrl}&wavepulseURL=${BASE_URL}`, {
            status: 200
        });
    }
}