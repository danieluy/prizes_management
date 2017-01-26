export class Notification {

  type: string;
  title: string;
  message: string;
  timeOut: number;
  timer: number;

  constructor(type: string, title: string, message?: string, timeOut?: number) {
    this.type = type;
    this.title = title;
    if (message) this.message = message;
    if (timeOut) {
      if (timeOut.toString().match(/\.|\,|\D/g) || timeOut % 1000 !== 0)
        throw new Error('timeOut parameter must be null or an integer multiple of 1000 (representing milliseconds)')
      else {
        this.timeOut = timeOut;
        this.timer = timeOut / 1000;
      }
    };
  }

}