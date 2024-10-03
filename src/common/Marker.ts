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

  constructor(
    id: string,
    name: string,
    color: string,
    category: string,
    pointers?: Pointer[]
  ) {
    super();
    this.id = id;
    this.name = name;
    this.color = color;
    this.category = category;
    this.pointers = pointers ?? [];
    this.activePointer = null;
    this.hasChanges = false;
  }

  saveEditData(
    newName: string,
    newColor: string,
    newCategory: string,
    newPointers: Pointer[]
  ) {
    this.name = newName;
    this.color = newColor;
    this.category = newCategory;
    this.pointers = newPointers;
    this.hasChanges = false;
  }

  setHasChanges(hasChanges: boolean) {
    this.hasChanges = hasChanges;
  }

  createPointer(x: number, y: number) {
    const newPointer = { id: Lodash.uniqueId(), x, y };
    return newPointer;
  }

  editPointer(editedPointer: Pointer) {
    const pointer = this.pointers.find(
      (pointer) => pointer.id == editedPointer.id
    );
    if (pointer) {
      pointer.x = editedPointer.x;
      pointer.y = editedPointer.y;
    } else {
      ErrUtil.assert(false);
    }
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
