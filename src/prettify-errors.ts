import { readFileSync } from 'fs'
import { Parser } from './parser'
import { PrettifyErrorOptions } from './prettify-options'

export class PrettifyError {
  private options: PrettifyErrorOptions
  constructor(options?: PrettifyErrorOptions) {
    this.options = options || {}
  }

  private structureError(
    lines: string[],
    start: number,
    end: number,
    lineNumber: number,
    columnNumber: number
  ) {
    for (let i = start; i <= end; i++) {
      if (i !== lineNumber) {
        console.log('  ' + (i - 1) + ' |' + lines[i - 1])
      } else {
        console.log('> ' + (i - 1) + ' |' + lines[i - 1])
        let col = columnNumber,
          space = ''
        while (col-- > 1) {
          space += ' '
        }
        console.log(space + '^')
      }
    }
    console.log('\n')
  }

  public printError(error: Error | any) {
    const parser = new Parser(error)
    const trace = parser.parse()
    const parsedTrace = trace[0]
    if (parsedTrace.fileName && parsedTrace.lineNumber && parsedTrace.columnNumber) {
      console.log('File Path:', parsedTrace.fileName, '\n')
      if (this.options.className) console.log('Class:', this.options.className)
      console.log('Function:', parsedTrace.functionName)
      const file = readFileSync(parsedTrace.fileName, 'utf8')
      const lines = file.split('\n')
      const start = parsedTrace.lineNumber - 2,
        end = parsedTrace.lineNumber + 2
      this.structureError(lines, start, end, parsedTrace.lineNumber, parsedTrace.columnNumber)
      if (error['stack']) {
        console.log(error['stack'])
      } else {
        console.log('No stack trace found')
        return
      }
    }
  }
}
