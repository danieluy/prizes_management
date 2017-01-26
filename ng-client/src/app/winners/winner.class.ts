export class Winner {

  public id: string;
  private ci: string;
  public name: string;
  public lastname: string;
  public facebook: string;
  private gender: string;
  public phone: string;
  public mail: string;
  public prizes: Array<any>;
  private set_date: number;
  private update_date: number;

  constructor(id: string, ci: string, name: string, lastname: string, facebook: string, gender: string, phone: string, mail: string, prizes: Array<any>, set_date: number, update_date: number) {
    this.id = id;
    this.ci = ci;
    this.name = name;
    this.lastname = lastname;
    this.facebook = facebook;
    this.gender = gender;
    this.phone = phone;
    this.mail = mail;
    this.prizes = prizes;
    this.set_date = set_date;
    this.update_date = update_date;
  }

  public get Id(): string {
    return this.id;
  }
  public get Ci(): string {
    let formatted_ci = '';
    let ci_arr = this.ci.split('');
    if (ci_arr.length === 6)
      formatted_ci = `${ci_arr[0]}${ci_arr[1]}.${ci_arr[2]}${ci_arr[3]}${ci_arr[4]}-${ci_arr[5]}`;
    if (ci_arr.length === 7)
      formatted_ci = `${ci_arr[0]}${ci_arr[1]}${ci_arr[2]}.${ci_arr[3]}${ci_arr[4]}${ci_arr[5]}-${ci_arr[6]}`;
    if (ci_arr.length === 8)
      formatted_ci = `${ci_arr[0]}.${ci_arr[1]}${ci_arr[2]}${ci_arr[3]}.${ci_arr[4]}${ci_arr[5]}${ci_arr[6]}-${ci_arr[7]}`;
    if (ci_arr.length === 9)
      formatted_ci = `${ci_arr[0]}${ci_arr[1]}.${ci_arr[2]}${ci_arr[3]}${ci_arr[4]}.${ci_arr[5]}${ci_arr[6]}${ci_arr[7]}-${ci_arr[8]}`;
    return formatted_ci;
  }
  public get CiRaw(): string {
    return this.ci;
  }
  public set CiRaw(ci: string) {
    this.ci = ci;
  }
  public get Name(): string {
    return this.name;
  }
  public get Lastname(): string {
    return this.lastname;
  }
  public get Facebook(): string {
    return this.facebook;
  }
  public get Gender(): string {
    let gender = 'Femenino';
    if (this.gender === 'M') gender = 'Masculino';
    if (this.gender === 'O') gender = 'Otro';
    return gender;
  }
  public get GenderRaw(): string {
    return this.gender;
  }
  public get Phone(): string {
    return this.phone;
  }
  public get Mail(): string {
    return this.mail;
  }
  public get StrSetDate(): string {
    return this.dateToString(this.set_date);
  }
  public get Prizes(): Array<any> {
    return this.prizes;
  }
  public get StrUpdateDate(): string {
    return this.dateToString(this.update_date);
  }
  public get IsCurrent(): boolean {
    for (let i = 0; i < this.prizes.length; i++) {
      if (!this.prizes[i].handed)
        return true;
    }
    return false;
  }

  public matches(query: string): boolean {
    let regex = new RegExp(this.escapeString(query.trim()), 'gi');
    if (this.ci.match(regex)) return true;
    if (this.name.match(regex)) return true;
    if (this.lastname.match(regex)) return true;
    if (this.name.match(regex)) return true;
    if (this.Ci.match(regex)) return true;
    return false;
  }

  private dateToString(date: number): string {
    let aux: Date = new Date(date);
    return aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getUTCFullYear();
  }

  private escapeString(txt: string): string {
    return txt.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

}