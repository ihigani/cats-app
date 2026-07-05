import { MouseModel } from 'src/models/mouse/mouse.model';

export interface IMouseSerialized {
  id: number;
  name: string;
}

export class MouseSerializer {
  static serialize(mouse: MouseModel): IMouseSerialized {
    return {
      id: mouse.id,
      name: mouse.name,
    };
  }
}
