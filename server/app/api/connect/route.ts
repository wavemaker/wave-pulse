import { NextRequest } from "next/server";

const channels = {} as any;

export async function GET(
    request: NextRequest
  ) {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get('appId');
    const expoUrl = searchParams.get('expoUrl');
    const channelId = searchParams.get('channelId');
    let url = '';
    if (appId) {
      url = `${appId}://wavepulse/connect?channelId=${channelId}&url=${searchParams.get('wavepulseURL')}`;
    }
    if (expoUrl) {
      url = `${expoUrl}/--/wavepulse/connect?channelId=${channelId}&url=${searchParams.get('wavepulseURL')}`;
    }
    return new Response(`
      <html>
        <head>
          <meta name="viewport" content="width=device-width, user-scalable=no">
          
        </head>
        <body>
          If you are not automatically redirected to App, please click on the below link.
          <br>
          <a href="${url}">${url}</a>
          <script>
            window.location.href = "${url}";
          </script>
        </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    });
}
