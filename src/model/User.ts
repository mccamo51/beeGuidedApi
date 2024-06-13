import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';



@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  name: string;

  @Column()
  email: string;


  @Column()
  password: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;

  }
}
