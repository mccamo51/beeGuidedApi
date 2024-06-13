import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';



@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  name: string;

  @Column()
  uuid: string;


  constructor(name: string, uuid: string) {
    this.name = name;
    this.uuid = uuid;
  }
}
