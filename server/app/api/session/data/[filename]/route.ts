import { tmpdir } from 'node:os';
import { streamFile } from "../../../../../wavepulse/zip";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params}: {params: {filename: string}}) {
    const zipPath = `${tmpdir}/${params.filename}`;
    const name = request.nextUrl.searchParams.get('name') as string
    return new Response(streamFile(zipPath), {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename=${name || params.filename}`
        }
    });
}