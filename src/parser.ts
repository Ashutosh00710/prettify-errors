import { CallSite } from './call-stite'
import { ParsedStackTrace } from './parsed-stack-trace'

export class Parser {
  private error: any
  constructor(error: any) {
    this.error = error
  }

  private createParsedCallSite(properties: ParsedStackTrace) {
    return new CallSite(properties)
  }

  parse(): Array<CallSite> {
    if (!this.error.stack) {
      return []
    }

    const lines: string[] = this.error.stack.split('\n').slice(1)
    return lines
      .map<ParsedStackTrace>(line => {
        if (line.match(/^\s*[-]{4,}$/)) {
          return this.createParsedCallSite({
            fileName: line.includes('file:///') ? line.substring(8) : line,
            lineNumber: null,
            functionName: null,
            typeName: null,
            methodName: null,
            columnNumber: null,
            native: null
          })
        }

        const lineMatch = line.match(/at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/)
        if (!lineMatch) {
          return this.createParsedCallSite({
            fileName: null,
            lineNumber: null,
            functionName: null,
            typeName: null,
            methodName: null,
            columnNumber: null,
            native: null
          })
        }

        let object = null
        let method = null
        let functionName = null
        let typeName = null
        let methodName = null
        const isNative = lineMatch[5] === 'native'

        if (lineMatch[1]) {
          functionName = lineMatch[1]
          let methodStart = functionName.lastIndexOf('.')
          if (functionName[methodStart - 1] == '.') methodStart--
          if (methodStart > 0) {
            object = functionName.substring(0, methodStart)
            method = functionName.substring(methodStart + 1)
            const objectEnd = object.indexOf('.Module')
            if (objectEnd > 0) {
              functionName = functionName.substring(objectEnd + 1)
              object = object.substring(0, objectEnd)
            }
          }
        }

        if (method) {
          typeName = object
          methodName = method
        }

        if (method === '<anonymous>') {
          methodName = null
          functionName = null
        }

        const properties = {
          fileName: lineMatch[2]
            ? lineMatch[2].includes('file:///')
              ? lineMatch[2].substring(8)
              : lineMatch[2]
            : null,
          lineNumber: parseInt(lineMatch[3], 10) || null,
          functionName: functionName,
          typeName: typeName,
          methodName: methodName,
          columnNumber: parseInt(lineMatch[4], 10) || null,
          native: isNative
        }

        return this.createParsedCallSite(properties)
      })
      .filter(function(callSite) {
        return !!callSite
      })
  }
}
