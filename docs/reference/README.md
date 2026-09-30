# The reference prototype

`prototype/` is a working, hand-built version of the site in plain HTML, CSS
and JavaScript. **It is the design.** Build the Astro site by copying its
markup, stylesheet and scripts, and replacing its sample text with the owner's
content. Every name, project, job, date and number in it is invented sample
content, not the owner's. Never copy sample content into the site.

## Files

| file | what it is |
|---|---|
| `prototype/index.html` | the home page: sheets 1 to 5 and the approval block |
| `prototype/part.html` | one part sheet (a project page) |
| `prototype/assets/blueprint.css` | every style, in numbered sections. Port it as is |
| `prototype/assets/scrubber.js` | the revision scrubber. Its header lists the markup contract |
| `prototype/assets/parts.js` | the exploded view's hover, focus and mobile picker |
| `prototype/assets/form.js` | sends the contact form in place |
| `prototype/fonts/` | Anybody (latin subset) and its licence; already copied to `public/fonts/` |
| `screens/` | screenshots of the prototype, for comparison |

## How to open it

It must be served over HTTP, or the font will not load. From the repo root:

```sh
npx serve docs/reference/prototype
# or
python3 -m http.server 8765 --directory docs/reference/prototype
```

Then open the address it prints. Try the scrubber (drag, click the stops, use
the arrow keys), hover the parts, and resize the window from 390px to 1440px.
Turn JavaScript off to see the no-JS state.

## Screenshots

| file | shows |
|---|---|
| `01-home-desktop-1440.jpg` | the whole home page at 1440px, at v0.9 |
| `02-home-mobile-390.jpg` | the whole home page at 390px |
| `03a-scrubber-v0.1.jpg` | the hero at v0.1: the sketch, one skill, headline for year 1 |
| `03b-scrubber-v0.5.jpg` | the hero at v0.5: modules drawn, new ones dashed amber |
| `03c-scrubber-v1.0-locked.jpg` | the hero at v1.0: the "Release pending" stamp |
| `04a-parts-hover-part3-at-v0.5.jpg` | the exploded view with part 3 lifted, at v0.5 (unbuilt parts faded) |
| `04b-parts-mobile-pick-3.jpg` | the mobile picker with part 3 chosen |
| `05-part-desktop-1440.jpg` | a part sheet at 1440px |
| `06-part-mobile-390.jpg` | a part sheet at 390px |

## Where the real site differs from the prototype

- Text comes from `content/`, through Astro components. The sample content and
  the "Reference prototype" banner do not ship.
- The prototype's plate schematics and FIG. 3.1 use literal colours in SVG
  attributes; in the site, keep the same colours (they are the palette tokens).
- The prototype has some `style=""` attributes for one-off sizes. In the site,
  prefer a class in `blueprint.css` (ask the owner before adding one).
- The number of plates, parts list rows, revisions rows and certifications
  depends on the owner's content.
- The contact form's action uses the owner's Formspree ID, and links point to
  the owner's real profiles and résumé.
