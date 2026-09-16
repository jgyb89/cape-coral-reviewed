import { getEvents } from "./src/lib/graphql/events.js";

async function run() {
  const events = await getEvents();
  console.log("Events:", JSON.stringify(events, null, 2));
}

run();
