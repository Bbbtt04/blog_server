import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { UserRole } from '../users/entities/user.entity';
import { QueryContentDto } from './dto/query-content-dto';

@ApiTags('文章模块')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get('archive')
  getArchive() {
    return this.contentsService.getArchive();
  }

  @Get('/search')
  search(@Query() query) {
    const { keyword = '', tagName = [], categoryName = '' } = query;
    return this.contentsService.search(keyword, tagName, categoryName);
  }

  @Auth([UserRole.Admin])
  @Post()
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto);
  }

  @Get()
  findAll(@Query() query: QueryContentDto) {
    return this.contentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(id);
  }

  @Auth([UserRole.Admin])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentsService.update(id, updateContentDto);
  }

  @Auth([UserRole.Admin])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentsService.remove(id);
  }
}
