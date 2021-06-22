const util = require('util'); // dump filter
const del = require('del'); // deleting _site folder
const got = require("got"); // HTTP request library
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const { wordCount } = require("eleventy-plugin-wordcount");
const metagen = require('eleventy-plugin-metagen');
const { getStranice } = import('./src/site/_data/stranicehr.js');

module.exports = function (config) {

  //console.log(JSON.stringify({ getStranice }));

  // A useful way to reference the context we are runing eleventy in
  let env = process.env.ELEVENTY_ENV;

  // Brisanje _site foldera prije builda
  const dirToClean = '_site/*';
  del(dirToClean);

  // Layout aliases can make templates more portable
  config.addLayoutAlias('default', 'layouts/base.njk');
  config.addLayoutAlias('static', 'layouts/page.njk');

  /* Filters */
  config.addFilter("squash", require("./src/utils/filters/squash.js") );
  config.addFilter("dateEn", require("./src/utils/filters/dateen.js"));
  config.addFilter("dateHr", require("./src/utils/filters/datehr.js"));
  config.addFilter('dump', obj => {
    return util.inspect(obj);
  });
  config.addFilter('debugger', (...args) => {
    console.log(...args)
    debugger;
  });
  // Limit umjesto slice
  config.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));
  // JSON-LD escape special characters
  config.addFilter("jsonldesc", obj => {
    const json = JSON.stringify(obj);
    const jsonesc = JSON.stringify(json);
    const escstring = JSON.parse(jsonesc);
    return escstring;
  });

  /* RSS */
  config.addPlugin(pluginRSS);
  // RSS file size filter
  config.addNunjucksAsyncFilter("size", async (url, callback) => {
    try {
      const { headers } = await got.head(url);
      const clength = headers.hasOwnProperty("content-length")
        ? headers["content-length"]
        : "Unknown";
      callback(null, clength);
    } catch (err) {
      console.error(err);
      callback(err);
    }
  });
  // RSS file MIME type
  config.addNunjucksAsyncFilter("type", async (url, callback) => {
    try {
      const { headers } = await got.head(url);
      const clength = headers.hasOwnProperty("content-type")
        ? headers["content-type"]
        : "Unknown";
      callback(null, clength);
    } catch (err) {
      console.error(err);
      callback(err);
    }
  });
  // RSS RFC822 time
  config.addFilter("rfc822", dateObj => {
    return new Date(dateObj).toUTCString();
  });

  /* Shortcodes */
  config.addShortcode("og_updated_time", () => new Date()
  );

  /* Plugins */
  config.addPlugin(wordCount);
  config.addPlugin(metagen);

  /* minify the html output */
  if (env != 'dev') {
    config.addTransform("htmlmin", require("./src/utils/minify-html.js"));
  }

    /* pass some assets right through */
  config.addPassthroughCopy("./src/site/images");
  config.addPassthroughCopy("./src/site/css");
  config.addPassthroughCopy("./src/site/js");
  config.addPassthroughCopy("./src/site/plugins");
  config.addPassthroughCopy("./src/site/colors");

  /* make the seed target act like prod */
  env = (env=="seed") ? "prod" : env;
  return {
    dir: {
      input: "src/site",
      output: "_site"
    },
    templateFormats : ["njk", "md", "11ty.js"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };

};
