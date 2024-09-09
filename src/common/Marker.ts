class Marker {
  public id: string;
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  setName(newName: string) {
    this.name = newName;
  }
}

export default Marker;
