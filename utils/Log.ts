import chalk from 'chalk';

export default class Log {

  declare private type: 'info' | 'success' | 'warn' | 'error';

  private log(type: Log['type'], message: string) {
    const color = this.getColor(type);
    console.log(chalk[color].bold(`[${type.toUpperCase()}]`) + ' ' + message);
  }

  public static info(message: string) {
    (new Log).log('info', message);
  }

  public static success(message: string) {
    (new Log).log('success', message);
  }

  public static warn(message: string) {
    (new Log).log('warn', message);
  }

  public static error(message: string) {
    (new Log).log('error', message);
  }

  private getColor(type: Log['type']): string {
    let color;
    if (type === 'info') color = 'blue';
    else if (type === 'success') color = 'green';
    else if (type === 'error') color = 'red';
    else if (type === 'warn') color = 'yellow';
    return color;
  }

}
