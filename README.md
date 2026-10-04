# Margin of Error

The personal site of Sarath Chandra Yanamandra. Built with [Eleventy](https://www.11ty.dev/), hosted on Cloudflare.

## How to publish a new article

1. Go to the `src/posts` folder in this repository on GitHub.
2. Click **Add file**, then **Create new file**.
3. Name it with words and a `.md` ending, for example `my-new-article.md`. Those words become the web address (marginoferror.in/writing/my-new-article/).
4. Paste this at the top and fill it in:

   ```
   ---
   title: "Your Article Title"
   date: 2026-10-01
   dek: "The one sentence that makes someone want to read it."
   categories: ["AI", "Marketing"]
   readtime: "6 min"
   cover: "/images/covers/your-image.jpg"
   ---
   ```

   Categories can be any of: AI, Marketing, Media & Culture, Operating notes.
   `cover` is optional: it shows as the thumbnail in the list, the big image on the
   essay page, and the preview image when the essay is shared. Put the image file in
   `src/images/covers/` first. Leave the line out for no cover.

## Images

Images live in `src/images` (covers, projects, portrait, texture, diagrams). Replace any
file with your own using the same name and it appears automatically.

## Projects

Each project is its own page, exactly like an essay. Add one by creating a Markdown file in
`src/projects/`, for example `my-project.md`, with this front matter:

```
---
number: "04"
title: "Your Project Title"
kicker: ["Concept study", "Operating design"]
dek: "One line describing the project."
cover: "/images/projects/your-image.jpg"
status: "Concept study"
date: 2026-04-01
---
```

The `/projects/` list and the home-page teaser update themselves. `date` controls the order
(earlier date = higher in the list).

## Interactive blocks

Drop any of these into a project (or essay) Markdown body. The scripts are already loaded.

Tabs / toggle:

```
<div class="tabs" data-tabs>
  <div class="tab-row">
    <button class="tab on" data-tab="a">First</button>
    <button class="tab" data-tab="b">Second</button>
  </div>
  <div class="tab-panel" data-panel="a"><p>First panel.</p></div>
  <div class="tab-panel" data-panel="b" hidden><p>Second panel.</p></div>
</div>
```

Live chart (type is "bar" or "line"):

```
<div class="chart" data-chart='{"type":"bar","unit":"%","data":[{"label":"A","value":45},{"label":"B","value":92}]}'></div>
```

Expandable note:

```
<details class="expand"><summary>Question</summary><p>Answer.</p></details>
```

Embed (Figma, Loom, YouTube, anything in an iframe):

```
<div class="embed"><iframe title="Demo" src="https://your-embed-url"></iframe></div>
```

Before/after slider and the custom calculator tool are shown in full in
`src/projects/localisation-operating-model.md`, copy from there.
5. Below the second `---`, write the article in Markdown (plain text, with `## Headings`, `**bold**`, and `> quotes`).
6. Scroll down and click **Commit changes**.

That is it. The homepage, the Writing archive, the category filters, and the article's own page all update by themselves within a minute or two.

## Editing an existing post

Open its `.md` file in `src/posts`, click the pencil, edit, and commit.

## Local preview (optional, for later)

```
npm install
npm start
```
