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

## Images and projects

Images live in `src/images` (covers, projects, portrait, texture, diagrams). Replace any
file with your own using the same name and it appears automatically. Projects are edited
in `src/_data/projects.json`.
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
