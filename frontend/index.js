import {
  dummyUsers,
  getPusherClient,
  renderMessage,
  setCookie,
} from "./utils.js";

let channel;

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const input = document.querySelector("#username");
  const username = input.value;

  if (!dummyUsers.find((user) => user.user_info.name === username)) {
    alert("User not found");
    return;
  }
  setCookie({ name: "username", value: username, expiryInDays: 1 });
  renderMessage({
    query: "#username-display",
    message: `You have joined as ${username}`,
    className: "heading",
  });

  loginForm.style.display = "none";
  document.querySelector("#chat-area").style.display = "flex";

  const pusherClient = await getPusherClient();

  channel = pusherClient.subscribe("private-chat-channel");
  channel.bind("client-chat-event", (data) => {
    if (data) {
      renderMessage({
        query: ".messages",
        message: typeof data === "string" ? data : data?.message,
        className: "message",
      });
    }
  });
});

const messageForm = document.querySelector("#message-form");
messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const input = document.querySelector("#message");
  const message = input.value;

  await channel.trigger("client-chat-event", {
    message,
  });

  renderMessage({
    query: ".messages",
    message: `You: ${message}`,
    className: "message message-me",
  });

  input.value = "";
});
