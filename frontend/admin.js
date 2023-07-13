import { getPusherClient, renderMessage } from "./utils.js";

const pusher = getPusherClient();
const channel = pusher.subscribe("admin-channel");
channel.bind("flagged-message-event", (data) => {
  if (data) {
    renderMessage({
      query: ".messages",
      message: typeof data === "string" ? data : data?.message,
      className: "message message-admin",
    });
  }
});
