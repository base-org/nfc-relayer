import { createConnection, Connection } from 'typeorm';
import { PaymentTx } from '../models/PaymentTx';

let connection: Connection | null = null;

export async function getConnection(): Promise<Connection> {
  if (connection && connection.isConnected) {
    return connection;
  }

  connection = await createConnection({
    type: 'postgres',
    url: process.env.POSTGRES_CONN_STRING,
    entities: [PaymentTx],
    synchronize: true,
  });

  return connection;
}

export async function closeConnection(): Promise<void> {
  if (connection && connection.isConnected) {
    await connection.close();
  }
}