import { ParsedStackTrace } from './parsed-stack-trace'

export class CallSite {
  fileName: string | null
  lineNumber: number | null
  functionName: string | null
  typeName: string | null
  methodName: string | null
  columnNumber: number | null
  native: boolean | null
  constructor(properties: ParsedStackTrace) {
    this.fileName = properties.fileName
    this.lineNumber = properties.lineNumber
    this.functionName = properties.functionName
    this.typeName = properties.typeName
    this.methodName = properties.methodName
    this.columnNumber = properties.columnNumber
    this.native = properties.native
  }
}
