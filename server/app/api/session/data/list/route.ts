import { SESSION_DATA_DIRECTORY } from "@/app/api/constants";
import { readdirSync } from "fs";

export async function GET(request: Request) {
    const filenames = readdirSync(SESSION_DATA_DIRECTORY);
    return new Response(JSON.stringify(filenames.filter(f => {
        return f.endsWith('.data');
    })), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
  }