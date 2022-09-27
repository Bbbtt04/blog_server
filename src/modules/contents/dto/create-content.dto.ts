import { IsNotEmpty } from 'class-validator';

export class CreateContentDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  description: string;

  status?: string = 'publish';
  views?: number = 0;

  isComment?: boolean = true;
  isTop?: boolean = false;

  categoryId?: string;
  tagsId?: string[];
}
