import { assertEquals } from "@std/assert";
import parsePdf, { type Annotation } from "./mod.ts";

const sortByUrl = (a: Annotation, b: Annotation) =>
  (a.url ?? "").localeCompare(b.url ?? "");

const expectedText = `Hyphenator.js
Overview
Hyphenator.js is a free open source Javascript library that automatically hyphenates text
on websites. It comes in handy as a polyfill for legacy browsers that don't support CSS 3
hyphation at all or for modern browsers that do hyphenation, but do not provide hyphen‐
ation dictionaries for a partic ular language.
Hyphenator.js …
can be included by the creator of the website.
can be used as bookmarklet on any website.
is unobtrusive.
steps behind CSS 3 hyphenation if supported (how to use Hyphenator_Loader).
runs on the client in order that the HTML source of the website may be served clean and
svelte and that it can respond to text resizings by the user.
is highly configurable and has a well documented API.
relies on Franklin M. Liangs hyphenation algorithm (PDF) commonly known from LaTeX and
OpenOffice.
supports a large set of different languages.
provides services for customizing, merging and packing script and patterns.
also wraps URLs and Email-adresses.
is free software licensed under MIT License (Version 5.0.0 and above).
Quick links
Code
Download
Documentation
Quick guide
1. Download the recent version of Hyphenator.js
2. Use mergeAndPack.html to configure and minify Hyphenator.js and hyphenation
patterns.
3. Prepare your .html documents (i.e. add hyphenate-classes, set lang and add
Hyphenator.js)
4. Test it!
Get detailed instructions.
The bad parts
As with most things, there's a downside, too. Consider the following drawbacks before
using Hyphenator.js:
Hyphenator.js and the hyphenation patterns are quite large. A good compression and caching
is vital.
Automatic hyphenation can not be perfect: it may lead to misleading hyphenation like leg-ends
(depends on the pattern quality)
There's no support for special (aka non-standard) hyphenation (e.g. omaatje->oma-tje)
There's no way for Javascript to influence the algorithm for laying out text in the browser. Thus
we can't control how many hyphens occur on subsequent lines nor can we know which words
have actually to be hyphenated. Hyphenator.js just hyphenates all of them.
Philosophy
There is text and there is beautiful text
This beauty becomes manifest in content and representation. I'm firmly convinced that all
written text (well, most of it) deserves fine typography, that we deserve it. While hyphen‐
ation is just one of many tesserae that forms the appearance of text, it may be an impor‐
tant one.
There is code and there is sound code
In code there is readability, maintainability, performance and genius – and some con‐
straints of technology. As a hobbyist programmer I often feel like a hobbit surrounded by
wizards who campaign for these values. But being an agile hobbit gives me the freedom
to find my own way through the woods (thankfully free from evil in this area). I'm con‐
stantly in search of the most performant path to circumvent the constraints of technology
while maintaining readability and maintainability of my code. Sometimes this path is illumi‐
nated by a wizard
1
.
Issues and Requests
Each release is tested in various browsers with an automated testsuite. Nevertheless,
there will always be bugs. Please don't hesitate to submit them.
If you have a special use case and Hyphenator.js doesn't provide a solution, feel free to
submit a feature request.
And please, be patient. Hyphenator.js is a hobby of mine and sometimes other things
have precedence…
(1) Some of my coding wizards are:
Franklin Mark Liang for his beautiful hyphenation algorithm
Douglas Crockford for making Javascript a programming language
Vyacheslav Egorov for his deep insights to V8
Bram Stein for his initiative on web typography`;

const expectedTotalAnnotations = [
  {
    url: "http://mnater.github.io/Hyphenator/testsuite/",
  },
  {
    url: "https://github.com/mnater/Hyphenator/issues",
  },
  {
    url: "https://github.com/mnater/Hyphenator/issues",
  },
  {
    url: "http://www.tug.org/docs/liang/",
  },
  {
    url: "http://www.crockford.com/",
  },
  {
    url: "http://mrale.ph/",
  },
  {
    url: "http://stateofwebtype.com/",
  },
  {
    url: undefined,
  },
  {
    url:
      "https://github.com/mnater/Hyphenator/blob/wiki/en_HowToUseHyphenator.md#using-hyphenator-on-your-website",
  },
  {
    url:
      "https://github.com/mnater/Hyphenator/blob/wiki/en_HowToUseHyphenator.md#using-hyphenator-as-a-bookmarklet",
  },
  {
    url: "http://en.wikipedia.org/wiki/Unobtrusive_JavaScript",
  },
  {
    url:
      "https://github.com/mnater/Hyphenator/blob/wiki/en_HowToUseHyphenator.md#hyphenator_loaderjs",
  },
  {
    url:
      "https://github.com/mnater/Hyphenator/blob/wiki/en_PublicAPI.md#public-api",
  },
  {
    url: "http://www.tug.org/docs/liang/liang-thesis.pdf",
  },
  {
    url:
      "https://github.com/mnater/Hyphenator/blob/wiki/en_AddNewLanguage.md#what-we-have-now",
  },
  {
    url: "http://mnater.github.io/Hyphenator/mergeAndPack.html",
  },
  {
    url: "http://mnater.github.io/Hyphenator/LICENSE.txt",
  },
  {
    url: "https://github.com/mnater/Hyphenator",
  },
  {
    url: "https://github.com/mnater/Hyphenator/releases/latest",
  },
  {
    url:
      "https://github.com/mnater/Hyphenator/blob/wiki/en_TableOfContents.md#table-of-contents",
  },
  {
    url: "https://github.com/mnater/Hyphenator/releases/latest",
  },
  {
    url: "http://mnater.github.io/Hyphenator/mergeAndPack.html",
  },
  {
    url:
      "https://github.com/mnater/Hyphenator/blob/wiki/en_HowToUseHyphenator.md#using-hyphenator-on-your-website",
  },
];

Deno.test("Parse remote PDF should work", async () => {
  const { text, info, metadata, numPages } = await parsePdf(
    "https://github.com/mozilla/pdf.js/files/1340729/Hyphenator.pdf",
  );

  assertEquals(text, expectedText);
  assertEquals(numPages, 2);
  assertEquals(metadata, null);
  assertEquals(info, {
    PDFFormatVersion: "1.4",
    Language: null,
    EncryptFilterName: null,
    IsLinearized: false,
    IsAcroFormPresent: false,
    IsXFAPresent: false,
    IsCollectionPresent: false,
    IsSignaturesPresent: false,
    Creator:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
    Producer: "Skia/PDF m61",
    CreationDate: "D:20170928110031+00'00'",
    ModDate: "D:20170928110031+00'00'",
  });
});

Deno.test("Parse local PDF should work", async () => {
  const { text, info, metadata, numPages } = await parsePdf(
    Deno.readFileSync(
      new URL(import.meta.resolve("./test_data/Hyphenator.pdf")),
    ),
  );

  assertEquals(text, expectedText);
  assertEquals(numPages, 2);
  assertEquals(metadata, null);
  assertEquals(info, {
    PDFFormatVersion: "1.4",
    Language: null,
    EncryptFilterName: null,
    IsLinearized: false,
    IsAcroFormPresent: false,
    IsXFAPresent: false,
    IsCollectionPresent: false,
    IsSignaturesPresent: false,
    Creator:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
    Producer: "Skia/PDF m61",
    CreationDate: "D:20170928110031+00'00'",
    ModDate: "D:20170928110031+00'00'",
  });
});

Deno.test("Parse local PDF should work including annotations", async () => {
  const { annotations } = await parsePdf(
    Deno.readFileSync(
      new URL(import.meta.resolve("./test_data/Hyphenator.pdf")),
    ),
    { includeAnnotations: true, maxPages: 1 },
  );

  assertEquals(
    annotations.length,
    15,
  );

  const { annotations: allAnnotations } = await parsePdf(
    Deno.readFileSync(
      new URL(import.meta.resolve("./test_data/Hyphenator.pdf")),
    ),
    { includeAnnotations: true },
  );

  assertEquals(allAnnotations.length, expectedTotalAnnotations.length);
  assertEquals(
    allAnnotations.toSorted(sortByUrl),
    expectedTotalAnnotations.toSorted(sortByUrl),
  );
});
