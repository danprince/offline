let fs = require("fs-extra");
let chalk = require("chalk");

async function clean(project) {
  await fs.remove(project.paths.build);
  await fs.remove(project.files.zip);
  console.log(` ${chalk.green("✓")} Cleaned`);
}

module.exports = clean;
