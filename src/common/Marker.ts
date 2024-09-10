class Marker {
  public id: string;
  public name: string;
  public color: string;

  constructor(id: string, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  setName(newName: string) {
    this.name = newName;
  }

  setColor(newColor: string) {
    this.color = newColor;
  }
}

export default Marker;
