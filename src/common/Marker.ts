class Marker {
  public id: string;
  public name: string;
  public color: string;
  public category: string;

  constructor(id: string, name: string, color: string, category: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.category = category;
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
}

export default Marker;
