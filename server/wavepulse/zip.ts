import AdmZip from 'adm-zip';
import { createReadStream, ReadStream } from "fs";

export const zipDirectory = async (sourceDir: string, outputFilePath: string) => {
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDir);
    await zip.writeZipPromise(outputFilePath);
};

export const unzipToDirectory = async (zipFilePath: string, to: string) => {
    const zip = new AdmZip(zipFilePath);
    return new Promise<void>((resolve, reject) => {
        zip.extractAllToAsync(to, true, true, (error: any) => {
            if (error) {
                console.log(error);
                reject(error);
                return false;
            } else {
                resolve();
                return true;
            }
        });
    });
};


async function* nodeStreamToIterator(stream: ReadStream) {
    for await (const chunk of stream) {
        yield new Uint8Array(chunk);
    }
}

function iteratorToStream(iterator: any) {
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
    });
}

export function streamFile(path: string): ReadableStream {
    const nodeStream = createReadStream(path);
    const data: ReadableStream = iteratorToStream(
        nodeStreamToIterator(
            nodeStream
        )
    )
    return data
}
