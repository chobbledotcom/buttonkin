const fg = require("fast-glob");
const path = require("path");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

const images = fg.sync(["src/images/*.jpg"]);

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
    widths: [200, 400],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  eleventyConfig
    .addPassthroughCopy("src/assets")
    .addPassthroughCopy("src/images")
    .addPassthroughCopy("src/assets/pretty-atom-feed.xsl")
    .addPassthroughCopy({ "src/assets/favicon/*": "/" });

  eleventyConfig.addCollection("images", (collection) => {
    return images.map((i) => i.split("/")[2]).reverse();
  });

  eleventyConfig.addFilter("dateToRfc822", function (date) {
    return new Date(date).toUTCString();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["liquid", "md", "njk"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
