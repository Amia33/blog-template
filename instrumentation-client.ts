import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    { path: "/posts/*", method: "POST" },
    { path: "/albums/*", method: "POST" },
  ],
});
