import { NextApiRequest, NextApiResponse } from 'next';

const clients: Map<string, NextApiResponse> = new Map();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { uuid } = req.query;

    if (typeof uuid !== 'string') {
      res.status(400).json({ error: 'Invalid uuid' });
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    clients.set(uuid, res);
    console.log('set the uuid', uuid)

    req.on('close', () => {
      clients.delete(uuid);
    });
  } else {
    res.status(405).end();
  }
}

// This function would be called from other parts of your application
// to send events to connected clients
export function sendSSEEvent(uuid: string, data: any) {
  const client = clients.get(uuid);
  if (client) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}