import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PaymentTx {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  toAddress: string;

  @Column()
  chainId: number;

  @Column()
  amount: string;

  @Column()
  contractId: string;
}