import { CatModel } from 'src/models/cat/cat.model';
import {
  IMouseSerialized,
  MouseSerializer,
} from 'src/models/mouse/mouse.serializer';

export interface ICatSerialized {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
  image: string;
  mice: IMouseSerialized[];
}

export class CatSerializer {
  static serialize(cat: CatModel): ICatSerialized {
    return {
      id: cat.id,
      firstName: cat.firstName,
      lastName: cat.lastName,
      description: cat.description,
      image: cat.image,
      mice: cat.mice ? cat.mice.map((mouse) => MouseSerializer.serialize(mouse)) : [],
    };
  }
}
