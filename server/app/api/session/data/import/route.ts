import { NextResponse } from "next/server";
import { tmpdir } from 'node:os';
import { writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { unzipToDirectory } from "@/wavepulse/zip";

export async function POST(
    request: Request
) {
    const data = (await request.formData() as any);
    const file = data.get('file');
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
      }
    const zipPath = `${tmpdir}/wavepulse_${Date.now()}.zip`;
    const outputFilePath = `${tmpdir}/wavepulse_${Date.now()}`;
    const buffer = Buffer.from(await file.arrayBuffer()) as any;
    writeFileSync(zipPath, buffer);
    await unzipToDirectory(zipPath, outputFilePath);
    const sessionData = {} as any;
    readdirSync(outputFilePath).forEach(f => {
        console.log(`${outputFilePath}/${f}`);
        sessionData[f.split('.')[0]] = JSON.parse(readFileSync(`${outputFilePath}/${f}`, {encoding: "utf-8"}));
    });
    return NextResponse.json(sessionData);
}