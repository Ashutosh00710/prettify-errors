## Installation

```bash
npm install prettify-errors
```

```bash
yarn add prettify-errors
```

### Usage

```typescript
import { PrettifyError } from 'prettify-errors'

class TestClass {
  private readonly prettifyError = new PrettifyError({
    className: TestClass.name,
  })

  sampleFunction() {
    try {
      throw new Error('Some error message')
    } catch (error) {
      this.prettifyError.printError(error)
    }
  }
}
```

### Output

```bash
File Path: C:/lab/test-lib/index.js

Class: TestClass
Function: TestClass.sampleFunction
  7  |  sampleFunction() {
  8  |    try {
> 9  |      throw new Error('Some error message')
            ^
  10 |    } catch (error) {
  11 |      this._prettifyError.printError(error)


Error: Some error message
    at TestClass.sampleFunction (file:///C:/lab/test-lib/index.js:10:13)
    at file:///C:/lab/test-lib/index.js:17:17
    at ModuleJob.run (internal/modules/esm/module_job.js:183:25)
    at async Loader.import (internal/modules/esm/loader.js:178:24)
    at async Object.loadESM (internal/process/esm_loader.js:68:5)
```
