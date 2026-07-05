import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CatModel } from 'src/models/cat/cat.model';

@Table({
  tableName: 'mice',
  timestamps: true,
})
export class MouseModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @ForeignKey(() => CatModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare catId: number;

  @BelongsTo(() => CatModel)
  declare cat: CatModel;
}
