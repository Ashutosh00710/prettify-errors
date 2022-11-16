export interface ParsedStackTrace {
  fileName: string | null
  lineNumber: number | null
  functionName: string | null
  typeName: string | null
  methodName: string | null
  columnNumber: number | null
  native: boolean | null
}
