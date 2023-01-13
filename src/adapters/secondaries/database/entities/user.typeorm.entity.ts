import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'UserEntity' })
export class UserDBEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false })
  email: string;
  @Column({ nullable: true })
  familyName: string;
  @Column({ nullable: true })
  givenName: string;
  @Column({ nullable: false })
  password: string;
}
