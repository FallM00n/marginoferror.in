module.exports = function (eleventyConfig) {
  // Copy the stylesheet straight through to the built site.
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });

  // Take the first N items of a list (used for "recent writing" on the home page).
  eleventyConfig.addFilter("head", (arr, n) =>
    Array.isArray(arr) ? arr.slice(0, n) : []
  );

  // Format a date as "Nov 2025".
  eleventyConfig.addFilter("monthYear", (d) => {
    try {
      return new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
      }).format(new Date(d));
    } catch (e) {
      return "";
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
