// src/entity/Token.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'boolean' })
  email_notification!: boolean;

  @Column()
  push_notification!: boolean;

  @Column({ type: 'int' })
  userId!: number;

}
