export class Prize {

  private id: string;
  private type: string;
  private sponsor: string;
  private description: string;
  private stock: number;
  private note: string;
  private set_date: number;
  private update_date: number;
  private due_date: number;

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

  private dateToString(date: number): string {
    let aux: Date = new Date(date);
    return aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getUTCFullYear();
  }

} 