export class User {

  public id: string;
  public name: string;
  public email: string;
  public set_date: number;
  public role: string;
  public password: string;
  public password2: string;

  constructor(id: string, name: string, email: string, set_date: number, role: string) {
    this.email = email;
    this.id = id;
    this.name = name;
    this.role = role;
    this.set_date = set_date;
  }

  public get Id(): string {
    return this.id;
  }
  public get Name(): string {
    return this.name;
  }
  public get Email(): string {
    return this.email;
  }
  public get StrDate(): string {
    let date: Date = new Date(this.set_date);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getUTCFullYear();
  }
  public get Role(): string {
    return this.role.toLowerCase() == 'admin' ? 'Administrador' : 'Usuario';
  }
  public get Password(): string {
    return this.password;
  }

}