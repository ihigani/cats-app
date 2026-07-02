import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { MouseModel } from 'src/models/mouse/mouse.model';

@Table({
  tableName: 'cats',
  timestamps: true,
})
export class CatModel extends Model {
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
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: '',
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  declare image: string;

  @HasMany(() => MouseModel)
  declare mice: MouseModel[];
}
