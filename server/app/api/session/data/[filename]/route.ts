import { SESSION_DATA_DIRECTORY } from "@/app/api/constants";
import { createReadStream, existsSync, ReadStream, writeFileSync } from "fs";
import moment from "moment";

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

function streamFile(path: string): ReadableStream {
    const nodeStream = createReadStream(path);
    const data: ReadableStream = iteratorToStream(
        nodeStreamToIterator(
            nodeStream
        )
    )
    return data
}

export async function GET(
    request: Request,
    { params }: { params: { filename: string } }
  ) {
    const filePath = `${SESSION_DATA_DIRECTORY}/${params.filename}`;
    const stream: ReadableStream = streamFile(filePath)
    return new Response(stream, {
        status: 200,
        headers: new Headers({
            "content-type": "application/json"
        })
    });
}

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const content = (request.body as any)['content'];
    let startWith = (request.body as any)['name'] || moment().format('DD-MMM-YYYY-HH-mm');
    let fileName = `${SESSION_DATA_DIRECTORY}/${startWith}.data`;
    for(var i = 0; existsSync(fileName); i++) {
        fileName = `${SESSION_DATA_DIRECTORY}/${startWith}(${i+1}).data`;
    }
    writeFileSync(fileName, content, 'utf-8');
    return new Response(JSON.stringify({
        'success': true
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}