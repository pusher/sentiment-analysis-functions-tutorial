import Sentiment from "sentiment";
import Pusher from "pusher";

const sentiment = new Sentiment();

const getPusherClient = async ({
  PUSHER_APP_KEY,
  PUSHER_APP_SECRET,
  PUSHER_APP_CLUSTER,
  PUSHER_APP_ID,
}) =>
  new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_APP_KEY,
    secret: PUSHER_APP_SECRET,
    cluster: PUSHER_APP_CLUSTER,
    useTLS: true,
  });

async function handler(pusher) {
  try {
    const { data, channel } = pusher;
    const result = sentiment.analyze(data.message);

    if (result.score < 0) {
      const [
        PUSHER_APP_KEY,
        PUSHER_APP_SECRET,
        PUSHER_APP_CLUSTER,
        PUSHER_APP_ID,
      ] = await Promise.all([
        pusher.getConfig("PUSHER_APP_KEY"),
        pusher.getConfig("PUSHER_APP_SECRET"),
        pusher.getConfig("PUSHER_APP_CLUSTER"),
        pusher.getConfig("PUSHER_APP_ID"),
      ]);

      const pusherClient = await getPusherClient({
        PUSHER_APP_KEY,
        PUSHER_APP_SECRET,
        PUSHER_APP_CLUSTER,
        PUSHER_APP_ID,
      });

      await pusherClient.trigger("admin-channel", "flagged-message-event", {
        message: `
          Hi admin, A negative message has been detected in the ${channel} channel.
          The message was flagged as negative because of these words: ${result.words.join(
            ", "
          )}.
        `,
      });
    }
  } catch (error) {
    console.error("error >>>>", error);
  }
}

exports.handler = handler;
