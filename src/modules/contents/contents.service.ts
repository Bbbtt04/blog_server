import { HttpException, Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Brackets, FindConditions, In, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { QueryContentDto } from './dto/query-content-dto';
import * as dayjs from 'dayjs';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createContentDto: CreateContentDto) {
    const exitCategory = await this.categoryRepository.findOne(
      createContentDto.categoryId,
    );
    const exitTags = await this.tagRepository.find({
      id: In(createContentDto.tagsId),
    });
    const createContent = this.contentRepository.create(createContentDto);
    createContent.category = exitCategory;
    createContent.tags = exitTags;
    return this.contentRepository.save(createContent);
  }

  async findAll(query?: QueryContentDto) {
    const { page = 1, pageSize = 10, status, ...otherQuery } = query;
    const contentQuery = await this.contentRepository
      .createQueryBuilder('content')
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .leftJoinAndSelect('content.tags', 'tags')
      .leftJoinAndSelect('content.category', 'category');

    if (status) {
      contentQuery.andWhere('content.status=:status', { status });
    }

    if (otherQuery) {
      Object.keys(otherQuery).forEach((q) =>
        contentQuery.andWhere(`content.${q} LIKE :${q}`, {
          [`${q}`]: `%${otherQuery[q]}%`,
        }),
      );
    }
    const list = await contentQuery.getMany();
    const cnt = await this.contentRepository.createQueryBuilder().getCount();
    return {
      cnt,
      list,
    };
  }

  findOne(id: string, selectCond?: FindConditions<any>) {
    this.updateViewById(id);
    return this.contentRepository.findOne(
      id,
      Object.assign(
        {
          relations: ['tags', 'category'],
        },
        selectCond,
      ),
    );
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    const { tagsId, categoryId } = updateContentDto;
    const exitContent = await this.contentRepository.findOne(id);
    if (!exitContent) {
      throw new HttpException('文章不存在', 401);
    }
    const updateContent = this.contentRepository.merge(
      exitContent,
      updateContentDto,
    );
    updateContent.category =
      (await this.categoryRepository.findOne(categoryId)) || null;
    updateContent.tags = await this.tagRepository.find({ id: In(tagsId) });

    return this.contentRepository.save(updateContent);
  }

  async remove(id: string) {
    const exitsContent = await this.contentRepository.findOne(id);
    if (!exitsContent) {
      throw new HttpException(`文章不存在`, 401);
    }
    return this.contentRepository.delete(id);
  }

  async getArchive() {
    const allContents = await this.contentRepository
      .createQueryBuilder('contents')
      .orderBy('contents.createdDate', 'DESC')
      .select([
        'contents.id',
        'contents.title',
        'contents.createdDate',
        'contents.description',
      ])
      .leftJoinAndSelect('contents.tags', 'tags')
      .leftJoinAndSelect('contents.category', 'category')
      .getMany();

    const data = [];
    let yearList = [];
    const rowsLen = allContents.length;
    for (let i = 0; i < allContents.length; i++) {
      yearList.push(dayjs(+allContents[i].createdDate).format('YYYY'));
    }
    yearList = [...new Set(yearList)];
    // 整理数据返回前端
    for (let i = 0; i < yearList.length; i++) {
      const obj = {
        year: yearList[i],
        list: [],
      };
      for (let j = 0; j < rowsLen; j++) {
        // 年份相同放入一个对象
        if (yearList[i] === dayjs(+allContents[j].createdDate).format('YYYY')) {
          obj.list.push(allContents[j]);
        }
      }
      data.push(obj);
    }

    return data;
  }

  async updateViewById(id: string) {
    const oldContent = await this.contentRepository.findOne(id);
    if (oldContent) {
      const updateContent = await this.contentRepository.merge(oldContent, {
        views: oldContent.views + 1,
      });
      return this.contentRepository.save(updateContent);
    }
    return;
  }

  search(keyword?: string, tagName?: string[], categoryName?: string) {
    const query = this.contentRepository.createQueryBuilder('content');

    // 根据关键字查询标题和内容
    if (keyword) {
      query
        .andWhere(
          new Brackets((qb) => {
            qb.where('content.title LIKE :keyword').orWhere(
              'content.content LIKE :keyword',
            );
          }),
        )
        .setParameter('keyword', `%${keyword}%`);
    }
    // 根据标签查询
    if (tagName.length) {
      query.innerJoinAndSelect(
        'content.tags',
        'tags',
        'tags.name in (:tagName)',
        { tagName },
      );
    } else {
      query.leftJoinAndSelect('content.tags', 'tags');
    }

    // 根据分类查询
    if (categoryName) {
      query.innerJoinAndSelect(
        'content.category',
        'category',
        'category.name = :categoryName',
        { categoryName },
      );
    } else {
      query.leftJoinAndSelect('content.category', 'category');
    }
    return query.getMany();
  }
}
