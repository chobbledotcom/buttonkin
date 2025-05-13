const path = require("path");
const fs = require("fs");
const sass = require("sass");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/**/*");

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    stylesheet: "/assets/pretty-atom-feed.xsl",
    templateData: {
      eleventyNavigation: {
        key: "Feed",
        order: 4,
      },
    },
    collection: {
      name: "post",
      limit: 20,
    },
    metadata: {
      language: "en",
      title: "Button Kin Games",
      subtitle:
        "Publishing original games and new content for table top roleplaying, aka TTRPGs",
      base: "https://buttonkin.com/",
      author: {
        name: "Yvris",
      },
    },
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: [200, 400, 800, 1600],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      // Don’t compile file names that start with an underscore
      if (parsed.name.startsWith("_")) {
        return;
      }

      // Get the directory of the input file for relative imports
      const dir = path.dirname(inputPath);

      return function (data) {
        return sass.compileString(inputContent, {
          loadPaths: [dir],
        }).css;
      };
    },
  });

  eleventyConfig
    .addPassthroughCopy("src/assets")
    .addPassthroughCopy("src/images")
    .addPassthroughCopy("src/assets/pretty-atom-feed.xsl")
    .addPassthroughCopy({ "src/assets/favicon.ico": "/favicon.ico" });

  eleventyConfig.addFilter("dateToRfc822", function (date) {
    return new Date(date).toUTCString();
  });

  const EXCLUDED_TAGS = ["post", "adventure", "game"];
  eleventyConfig.addFilter("tags", (tags) => {
    let result = [];
    tags.forEach((tag) => {
      if (!EXCLUDED_TAGS.includes(tag))
        result.push({
          tag: tag,
          name: tag.replace(/-/, " "),
        });
    });
    return result;
  });

  eleventyConfig.addFilter("file_exists", function (filepath) {
    return fs.existsSync(filepath.replace(/^\//, "./src/"));
  });

  eleventyConfig.addFilter("append", function (str, append) {
    return str + append;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["liquid", "md", "njk", "html"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
