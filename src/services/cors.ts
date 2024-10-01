import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors({
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: '*',
  optionsSuccessStatus: 200,
});

// eslint-disable-next-line @typescript-eslint/ban-types
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    if (!fn) {
      return reject(new Error('Middleware function is not defined'));
    }
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export async function applyCors(req: NextApiRequest, res: NextApiResponse) {
  try {
    await runMiddleware(req, res, cors);
  } catch (error) {
    console.error('Error applying CORS middleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}