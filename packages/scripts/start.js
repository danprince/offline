let fs = require("fs-extra");
let path = require("path");
let chalk = require("chalk");
let rollup = require("rollup");
let resolve = require("rollup-plugin-node-resolve");
let LiveServer = require("live-server");

async function start(project) {
  let config = {
    input: project.files.entry,
    plugins: [
      resolve()
    ],
    output: {
      sourcemap: "inline",
      file: project.files.bundle,
      format: "iife",
    },
    watch: {
      clearScreen: true
    }
  };

  let server = LiveServer.start({
    port: 8181,
    root: project.paths.build,
    mount: [["/", project.paths.public]],
    logLevel: 0,
    open: false,
  });

  server.on("listening", () => {
    let watcher = rollup.watch(config);
    let address = server.address();
    let url = `http://localhost:${address.port}`;

    watcher.on("event", event => {
      switch (event.code) {
        case "BUNDLE_START":
          clearScreen();
          console.log("Bundling...");
          break;

        case "BUNDLE_END":
          clearScreen();
          console.log(` ${chalk.green("✓")} Bundled in ${event.duration}ms`);
          console.log(` Listening on ${chalk.green(url)}`);
          console.log(` Watching for changes...`);
          break;

        case "ERROR":
          clearScreen();

          if (event.error.code === "PARSE_ERROR" || event.error.code === "MISSING_EXPORT") {
            let file = path.relative(process.cwd(), event.error.loc.file);
            console.log(` ${chalk.red("✖")} Error in ${chalk.red(file)}`);
            console.log();
            console.log(chalk.red(event.error.message));
            console.log(chalk.blue("-".repeat(80)));
            console.log(event.error.frame);
            console.log(chalk.blue("-".repeat(80)));
            console.log();
          } else {
            console.log(` ${chalk.red("✖")} Error: ${event.error.message}`);
          }

          console.log(` Listening on ${chalk.red(url)}`);
          console.log(` Watching for changes...`);
          break;

        case "FATAL":
          clearScreen();

          if (event.error.code === "PARSE_ERROR" || event.error.code === "MISSING_EXPORT") {
            let file = path.relative(process.cwd(), event.error.loc.file);
            console.log(` ${chalk.red("✖")} Fatal Error in ${chalk.red(file)}`);
            console.log();
            console.log(chalk.red(event.error.message));
            console.log(chalk.blue("-".repeat(80)));
            console.log(event.error.frame);
            console.log(chalk.blue("-".repeat(80)));
            console.log();
          } else {
            console.log(` ${chalk.red("✖")} Fatal Error`);
            throw event.error;
          }

          process.exit(1);
      }

      if (event.code === "ERROR" && event.error.code === "PARSE_ERROR") {
        fs.writeFile(project.files.bundle, `
          console.error(\` ✖ Error in ${file}\n\n${event.error.frame}\`);
        `);
      }
    });
  });
}

function clearScreen() {
  process.stdout.write('\x1B[2J\x1B[0f');
}

module.exports = start;
