import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Tag } from '../../tags/entities/tag.entity';
import { Category } from '../../categories/entities/category.entity';

export enum StatusContent {
  Publish = 'publish',
  Draft = 'draft',
}

@Entity()
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Exclude()
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: StatusContent,
    default: StatusContent.Publish,
  })
  status: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: true })
  isComment: boolean;

  @Column({ default: false })
  isTop: boolean;

  @ManyToOne(() => Category, (category) => category.content)
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.contents, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
