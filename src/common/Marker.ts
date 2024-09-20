class Marker {
  public id: string;
  public name: string;
  public color: string;
  public category: string;
  public hasChanges: boolean;

  constructor(id: string, name: string, color: string, category: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.category = category;
    this.hasChanges = false;
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
}

export default Marker;
