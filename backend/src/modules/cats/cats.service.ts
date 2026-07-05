import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { buildPaginatedResponse } from 'src/common/serializers/responses/paginated.response';
import { CatModel } from 'src/models/cat/cat.model';
import { CatSerializer } from 'src/models/cat/cat.serializer';
import { MouseModel } from 'src/models/mouse/mouse.model';
import { CreateCatDto, UpdateCatDto } from 'src/modules/cats/cats.schema';

interface IFindAllParams {
  page: number;
  limit: number;
  catName?: string;
  mouseName?: string;
}

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(CatModel)
    private readonly catModel: typeof CatModel,
    @InjectModel(MouseModel)
    private readonly mouseModel: typeof MouseModel,
  ) {}

  async findAll(params: IFindAllParams) {
    const { page, limit, catName, mouseName } = params;
    const offset = (page - 1) * limit;

    const whereClause: WhereOptions<CatModel> = catName
      ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${catName}%` } },
            { lastName: { [Op.iLike]: `%${catName}%` } },
          ],
        }
      : {};

    const mouseInclude = {
      model: MouseModel,
      as: 'mice' as const,
      required: Boolean(mouseName),
      ...(mouseName
        ? { where: { name: { [Op.iLike]: `%${mouseName}%` } } }
        : {}),
    };

    const { rows, count } = await this.catModel.findAndCountAll({
      where: whereClause,
      include: [mouseInclude],
      distinct: true,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return buildPaginatedResponse(
      rows.map((cat) => CatSerializer.serialize(cat)),
      count,
      page,
      limit,
    );
  }

  async findOne(id: number) {
    const cat = await this.catModel.findByPk(id, {
      include: [{ model: MouseModel, as: 'mice' }],
    });

    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    return CatSerializer.serialize(cat);
  }

  async create(createCatDto: CreateCatDto) {
    const cat = await this.catModel.create({
      firstName: createCatDto.firstName,
      lastName: createCatDto.lastName,
      description: createCatDto.description ?? '',
      image: createCatDto.image ?? '',
    });

    if (createCatDto.mice?.length) {
      await this.mouseModel.bulkCreate(
        createCatDto.mice.map((mouse) => ({
          name: mouse.name,
          catId: cat.id,
        })),
      );
    }

    return this.findOne(cat.id);
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.catModel.findByPk(id);

    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    await cat.update({
      ...(updateCatDto.firstName !== undefined
        ? { firstName: updateCatDto.firstName }
        : {}),
      ...(updateCatDto.lastName !== undefined
        ? { lastName: updateCatDto.lastName }
        : {}),
      ...(updateCatDto.description !== undefined
        ? { description: updateCatDto.description }
        : {}),
      ...(updateCatDto.image !== undefined ? { image: updateCatDto.image } : {}),
    });

    if (updateCatDto.mice !== undefined) {
      await this.mouseModel.destroy({ where: { catId: id } });
      if (updateCatDto.mice.length) {
        await this.mouseModel.bulkCreate(
          updateCatDto.mice.map((mouse) => ({
            name: mouse.name,
            catId: id,
          })),
        );
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const cat = await this.catModel.findByPk(id);

    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    await this.mouseModel.destroy({ where: { catId: id } });
    await cat.destroy();

    return { deleted: true };
  }
}
