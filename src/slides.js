import Reveal from "reveal.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.js";
import { AitSlide } from "./ait-slide.js";

let deck = new Reveal({
  controls: false,
  progress: false,
  slideNumber: false,
  hash: true,
  history: true,
  disableLayout: true,
  display: "flex",
  transition: "none",
  plugins: [RevealHighlight],
});

deck.initialize();
customElements.define("ait-slide", AitSlide);

// Set a scale based on available width
function scale() {
  let baseWidth = 1920;
  let { width } = document.body.getBoundingClientRect();
  let scale = width / baseWidth;
  document.documentElement.style.setProperty("--scale", `${scale}`);
}
scale();
window.addEventListener("resize", scale);
