import { NextRequest } from 'next/server';
import os from 'os';

function getIpAddress() {
    var interfaces = os.networkInterfaces();
    for(var key in interfaces) {
        var addresses = (interfaces[key])?.reverse();
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
const BASE_URL = process.env.WAVEPULSE_BASE_URL || `http://${getIpAddress()}:3000/wavepulse`;
export async function GET(
    request: NextRequest
  ) {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get('appId');
    const expoUrl = searchParams.get('expoUrl');
    const channelId = searchParams.get('channelId');
    let launchUrl = '';
    if (appId) {
        launchUrl = `${appId}://wavepulse/connect?channelId=${channelId}&url=${BASE_URL}`;
    }
    if (expoUrl) {
        launchUrl = `${expoUrl}/--/wavepulse/connect?channelId=${channelId}&url=${BASE_URL}`;
    }
    return new Response(`${BASE_URL}/connect?launchUrl=${encodeURIComponent(launchUrl)}`, {
        status: 200
    });
}