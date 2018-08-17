let fs = require("fs-extra");
let path = require("path");
let chalk = require("chalk");
let { rollup } = require("rollup");
let { zipSync } = require("cross-zip");
let { terser } = require("rollup-plugin-terser");
let resolve = require("rollup-plugin-node-resolve");

async function build(project) {
  let options = {
    input: {
      input: project.files.entry,
      plugins: [
        resolve(),
        terser({
          mangle: {
            module: true,
            //properties: {
            //  reserved: require("terser/tools/domprops")
            //}
          }
        })
      ]
    },
    output: {
      file: project.files.bundle,
      format: "iife",
      strict: false
    }
  };

  try {
    let bundle = await rollup(options.input);
    await bundle.write(options.output);
    console.log(` ${chalk.green("✓")} Bundled`);
  } catch (error) {
    if (error.code === "PARSE_ERROR" || error.code === "MISSING_EXPORT") {
      let file = path.relative(process.cwd(), error.loc.file);
      console.log(`${chalk.red("✖")} Error in ${chalk.red(file)}`);
      console.log();
      console.log(chalk.red(error.message));
      console.log(chalk.blue("-".repeat(80)));
      console.log(error.frame);
      console.log(chalk.blue("-".repeat(80)));
      console.log();
      return;
    } else {
      console.log(` ${chalk.red("✖")} Error`);
      throw error;
    }
  }

  // Copy files from public folder
  await fs.copy(project.paths.public, project.paths.build);

  // Zip build folder for release
  zipSync(project.paths.build, project.files.zip);
  console.log(` ${chalk.green("✓")} Zipped to ${path.basename(project.files.zip)}`);

  // Measure size of zipped release folder
  let stats = await fs.stat(project.files.zip);
  let bytes = stats.size;
  let used = bytes;
  let allowed = project.limit;

  let percentage = used / allowed;
  let color;

  if (percentage > 0) color = chalk.green;
  if (percentage > 0.8) color = chalk.yellow;
  if (percentage > 1) color = chalk.red;

  let usage = color(`(${used}B / ${allowed}B)`);
  console.log(` ${color("=")} ${Math.ceil(percentage * 100)}% ${usage}`);
}

module.exports = build;
