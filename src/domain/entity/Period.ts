export class Period {
  public readonly id: string;
  public dateStart: Date;
  public dateEnd: Date;
  public name: string;

  constructor(id: string, dateStart: Date, dateEnd: Date, name: string) {
    this.id = id;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.name = name;
  }
}
