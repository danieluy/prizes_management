export class Prize {

  public id: string;
  public type: string;
  public sponsor: string;
  public description: string;
  public stock: number;
  public note: string;
  public set_date: number;
  public update_date: number;
  public due_date: number;

  constructor(id: string, type: string, sponsor: string, description: string, stock: number, note: string, set_date: number, update_date: number, due_date: number) {
    this.id = id;
    this.type = type;
    this.sponsor = sponsor;
    this.description = description;
    this.stock = stock;
    this.note = note;
    this.set_date = set_date;
    this.update_date = update_date;
    this.due_date = due_date;
  }

  public get Id(): string {
    return this.id;
  }
  public get Type(): string {
    return this.type;
  }
  public get Sponsor(): string {
    return this.sponsor;
  }
  public get Description(): string {
    return this.description;
  }
  public get Stock(): number {
    return this.stock;
  }
  public get Note(): string {
    return this.note;
  }
  public get StrSetDate(): string {
    return this.dateToString(this.set_date);
  }
  public get StrDueDate(): string {
    return this.dateToString(this.due_date);
  }
  public get StrDueDateToPost(): string {
    return this.dateToPost(this.due_date);
  }
  public get DateToSetInput(): string{
    return this.stringToInput(this.due_date);
  }
  public set StrDueDate(str_date: string) {
    this.due_date = this.strgDateToInt(str_date);
  }

  private dateToPost(date: number): string {
    let aux: Date = new Date(date);
    return aux.getUTCFullYear() + '/' + (aux.getMonth() + 1) + '/' + aux.getDate();
  }
  private dateToString(date: number): string {
    let aux: Date = new Date(date);
    return aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getUTCFullYear();
  }
  private stringToInput(date: number): string {
    let aux: Date = new Date(date);
    return `${aux.getUTCFullYear()}-${(aux.getMonth() + 1)}-${aux.getDate()}`;
  }
  private strgDateToInt(str_date): number {
    if (!str_date)
      return null;
    if (str_date.match(/^\d{4}\-\d{2}\-\d{2}$/))
      return new Date(str_date.replace(/-/g, "/")).getTime();
    else if (str_date.match(/^\d{4}\/\d{2}\/\d{2}$/))
      return new Date(str_date).getTime();
    return null;
  }

} 