declare function require(path: string) : any;

const fecha = require('fecha')

export function date(date: string | Date, format: string = 'YYYY-MM-DD hh:mm A'): string {
  if (date instanceof Date) {
    return fecha.format(date, format)
  } else {
    return fecha.format(new Date(date), format)
  }
}