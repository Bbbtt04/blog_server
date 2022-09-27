import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '../users/entities/user.entity';
import { DbOptions } from '../../decorator/dbOptions.decorator';
import { QueryContentDto } from '../contents/dto/query-content-dto';
import { Auth } from '../../decorator/auth.decorator';

@ApiTags('标签')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Auth([UserRole.Admin])
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query() query: QueryContentDto, @DbOptions() dbOptions) {
    return this.tagsService.findAll(query, dbOptions);
  }

  @Auth([UserRole.Admin])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Auth([UserRole.Admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('relation')
  getTagRelation() {
    return this.tagsService.getRelation();
  }
}
