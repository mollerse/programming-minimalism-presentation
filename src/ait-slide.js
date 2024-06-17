import { EditorView, minimalSetup } from "codemirror";
import { dracula } from "@ddietr/codemirror-themes/dracula";
import { Ait } from "./ait-grammar/grammar.js";
import Browser from "ait-lang/runtimes/browser";
import { aitFFIPrint as print } from "ait-lang/ffi";
import canvas from "ait-canvas";

import flip from "../demos/01_flip.ait?raw";
import turn from "../demos/02_turn.ait?raw";
import toss from "../demos/03_toss.ait?raw";
import tiles from "../demos/04_tiles.ait?raw";
import tesselation from "../demos/05_tesselation.ait?raw";
import linrec from "../demos/06_linrec.ait?raw";

const CANVAS = "canvas";
const STACK = "stack";

function stackToHTML(stack) {
  let lis = stack
    .stack()
    .reverse()
    .map((v, i) => `<li key=${i}>${print(v)}</li>`);

  return `<ul class="stack">${lis.join("\n")}</ul>`;
}

export class AitSlide extends HTMLElement {
  /** @type {HTMLElement} */
  #editor;
  /** @type {HTMLElement} */
  #display;
  /** @type {HTMLCanvasElement} */
  #canvas;

  #runtime;

  constructor() {
    super();
  }

  connectedCallback() {
    this.#editor = /** @type {HTMLElement} */ (this.querySelector(".editor"));
    this.#display = /** @type {HTMLElement} */ (this.querySelector(".display"));
    let mode = this.#display.classList.contains("canvas") ? CANVAS : STACK;

    let demoType = this.getAttribute("demo") || "unknown";

    /** @type {Record.<string, string>} */
    let availableDocs = {
      flip: flip,
      turn: turn,
      toss: toss,
      tiles: tiles,
      tesselation: tesselation,
      linrec: linrec,
      unknown: "",
    };

    this.#runtime = Browser();
    Object.assign(this.#runtime.lexicon, canvas);

    let updateListenerExtension = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        this.#runtime.reset();

        if (mode === CANVAS) {
          let ctx = this.#runtime.scope["__aitCanvasContext"].body;
          ctx.reset();
          ctx.fillStyle = "#050505";
          ctx.fillRect(0, 0, 600, 600);
          this.#runtime.evaluate(update.state.doc.toString());
        } else {
          this.#runtime.evaluate(update.state.doc.toString());
          this.#display.innerHTML = stackToHTML(this.#runtime.stack);
        }
      }
    });

    let doc = availableDocs[demoType];

    new EditorView({
      doc: doc,
      extensions: [minimalSetup, dracula, Ait(), updateListenerExtension],
      parent: this.#editor,
    });

    if (mode === CANVAS) {
      let canvas = document.createElement("canvas");
      this.#display.appendChild(canvas);

      canvas.height = 600;
      canvas.width = 600;

      this.#runtime.program = [
        { type: "word", body: "canvasContext" },
        { type: "value", body: canvas },
      ];
      this.#runtime.executeProgram();
      this.#runtime.scope["__aitCanvasContext"].body.fillStyle = "black";
      this.#runtime.scope["__aitCanvasContext"].body.fillRect(0, 0, 600, 600);
      this.#runtime.scope["__aitCanvasContext"].body.save();
      this.#runtime.evaluate(doc);
    } else {
      this.#runtime.evaluate(doc);
      this.#display.innerHTML = stackToHTML(this.#runtime.stack);
    }
  }
}
