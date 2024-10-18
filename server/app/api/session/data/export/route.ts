import { mkdirSync, writeFileSync } from "fs";
import { tmpdir } from 'node:os';
import { zipDirectory } from "../../../../../wavepulse/zip";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    const data = (await request.formData() as any);
    const entries = JSON.parse(data.get('entries')) as string[];
    const fileName = data.get('filename') + '_' + Date.now();
    const path = `${tmpdir}/${fileName}`;
    const zipName = `${fileName}.zip`;
    const zipPath = `${tmpdir}/${zipName}`;
    mkdirSync(path, {
        recursive: true
    });
    entries.forEach(e => {
        writeFileSync(`${path}/${e}.json`, data.get(e), 'utf-8');
    });
    try {
        await zipDirectory(path, zipPath);
    } catch(e) {
        console.error(e);
    }
    return NextResponse.json({
        path: zipName
    });
}