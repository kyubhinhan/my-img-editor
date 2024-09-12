class Marker {
  public id: string;
  public name: string;
  public color: string;
  public size: string;

  constructor(id: string, name: string, color: string, size: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.size = size;
  }

  setName(newName: string) {
    this.name = newName;
  }

  setColor(newColor: string) {
    this.color = newColor;
  }

  setSize(newSize: string) {
    this.size = newSize;
  }
}

export default Marker;
