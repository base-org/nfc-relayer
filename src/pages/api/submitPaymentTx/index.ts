import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      res.status(201).json({ message: 'Dummy Endpoint, not yet implemented' });
    } catch (error) {
      console.error('Error storing payment:', error);
      res.status(500).json({ message: 'Error storing payment transaction params' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
