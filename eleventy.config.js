module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  eleventyConfig.addFilter("head", (arr, n) =>
    Array.isArray(arr) ? arr.slice(0, n) : []
  );

  eleventyConfig.addFilter("monthYear", (d) => {
    try {
      return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(d));
    } catch (e) {
      return "";
    }
  });

  eleventyConfig.addFilter("longDate", (d) => {
    try {
      return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
    } catch (e) {
      return "";
    }
  });

  // Next essay in the list (for the "Read next" link); null when there is none.
  eleventyConfig.addFilter("nextInList", (posts, url) => {
    const arr = posts || [];
    const i = arr.findIndex((p) => p.url === url);
    return i > -1 && i < arr.length - 1 ? arr[i + 1] : null;
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
