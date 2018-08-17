import * as view from "./view";
import * as sim from "./simulation";
import * as events from "./events";
import * as renderer from "./renderer";
import * as editor from "./editor";
import * as runner from "./runner";

//import "./music";

events.register(sim.dispatch);

sim.level(0);
sim.mode(editor);
renderer.driver.start();
