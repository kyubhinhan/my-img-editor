import Lodash from 'lodash';
import ErrUtil from './ErrUtil';
import { EventEmitter } from 'events';

type Pointer = {
  id: string;
  x: number;
  y: number;
};

class Marker extends EventEmitter {
  public id: string;
  public name: string;
  public color: string;
  public category: string;
  public hasChanges: boolean;
  public pointers: Pointer[];
  public activePointer: Pointer | null;

  constructor(id: string, name: string, color: string, category: string) {
    super();
    this.id = id;
    this.name = name;
    this.color = color;
    this.category = category;
    this.hasChanges = false;
    this.pointers = [];
    this.activePointer = null;
  }

  setName(newName: string) {
    this.name = newName;
  }

  setColor(newColor: string) {
    this.color = newColor;
  }

  setCategory(newCategory: string) {
    this.category = newCategory;
  }

  setHasChanges(hasChanges: boolean) {
    this.hasChanges = hasChanges;
  }

  addPointer(x: number, y: number) {
    const newPointer = { id: Lodash.uniqueId(), x, y };
    this.pointers.push(newPointer);
    return newPointer;
  }

  deletePointer(id: string) {
    ErrUtil.assert(this.pointers.some((pointer) => pointer.id == id));
    this.pointers = this.pointers.filter((pointer) => pointer.id != id);
  }

  findPointer(x: number, y: number) {
    return this.pointers.find((p) => {
      const squaredDistance = (p.x - x) ** 2 + (p.y - y) ** 2;
      return squaredDistance <= 8 ** 2;
    });
  }

  setActivePointer(activePointer: Pointer | null) {
    if (activePointer == null) {
      this.activePointer = null;
    } else {
      ErrUtil.assert(
        this.pointers.some((pointer) => pointer.id == activePointer.id)
      );
      this.activePointer = activePointer;
    }

    this.emit('activePointerChange', this.activePointer);
  }

  getActivePointer() {
    return this.activePointer;
  }
}

export default Marker;
export type { Pointer };
