import { parser } from "./ait.grammar";
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
  syntaxHighlighting,
  HighlightStyle,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

export const AitLang = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: "]", align: false }),
      }),
      foldNodeProp.add({
        Application: foldInside,
      }),
      styleTags({
        Identifier: t.variableName,
        String: t.string,
        LineComment: t.lineComment,
        Number: t.number,
        "[ ]": t.paren,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "#" },
  },
});

const myHighlightStyle = HighlightStyle.define([
  { tag: t.variableName, color: "#ebebeb" },
  { tag: t.lineComment, color: "hotpink", fontStyle: "italic" },
  { tag: t.string, color: "hotpink" },
  { tag: t.paren, color: "hotpink" },
  { tag: t.number, color: "hotpink" },
]);

export function AitHighlight() {
  return syntaxHighlighting(myHighlightStyle);
}

export function Ait() {
  return new LanguageSupport(AitLang);
}
