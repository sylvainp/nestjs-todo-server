import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TodoEntity' })
export default class TodoDBEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false })
  title: string;

  @Column({ default: false })
  isDone: boolean;
}
