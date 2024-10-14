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

export async function GET(
    request: NextRequest
  ) {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get('appId');
    const expoUrl = searchParams.get('expoUrl');
    if (appId) {
        return new Response(`http://${getIpAddress()}:3000/api/connect?appId=${appId}&wavepulseURL=http://${getIpAddress()}:3000`, {
            status: 200
        });
    }
    if (expoUrl) {
        return new Response(`http://${getIpAddress()}:3000/api/connect?expoUrl=${expoUrl}&wavepulseURL=http://${getIpAddress()}:3000`, {
            status: 200
        });
    }
}