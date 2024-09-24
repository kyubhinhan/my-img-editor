type Pointer = {
  x: number;
  y: number;
};

class Marker {
  public id: string;
  public name: string;
  public color: string;
  public category: string;
  public hasChanges: boolean;
  public pointers: Pointer[];

  constructor(id: string, name: string, color: string, category: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.category = category;
    this.hasChanges = false;
    this.pointers = [];
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
    this.pointers.push({ x, y });
  }
}

export default Marker;
