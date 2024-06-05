import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Organization } from 'src/organizations/entities/organization.entities';
@Entity()
export class users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Organization, (organization) => organization.userId)
  organizations: Organization[];
}
