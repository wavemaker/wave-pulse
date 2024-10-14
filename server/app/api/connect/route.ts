import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest
  ) {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get('appId');
    const expoUrl = searchParams.get('expoUrl');
    if (appId) {
      return Response.redirect(`${appId}://wavepulse/connect?url=${searchParams.get('wavepulseURL')}`);
    }
    if (expoUrl) {
      return Response.redirect(`${expoUrl}/--/wavepulse/connect?url=${searchParams.get('wavepulseURL')}`);
    }
}
