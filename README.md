# pdf-parse

A modern implementation of https://gitlab.com/autokent/pdf-parse. A thin wrapper
on top of pdf-js, just like the original.

```typescript
import parsePdf from "jsr:@lino/parse-pdf";

const { text, info } = await parsePdf(
  "https://github.com/mozilla/pdf.js/files/1340729/Hyphenator.pdf",
);
console.log(text, info);
```
