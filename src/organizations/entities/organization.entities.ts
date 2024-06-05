import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  razaoSocial: string;

  @Column()
  nomeFantasia: string;

  @Column()
  cnpj: string;

  @Column()
  regional: string;

  @Column({ type: 'timestamp' })
  dataInauguracao: Date;

  @Column('simple-array')
  especialidadesMedicas: string[];

  @Column()
  ativa: boolean;

  @Column()
  userId: number;
}
