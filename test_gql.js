import { getEvents } from "./src/lib/graphql/events.js";

async function run() {
  const events = await getEvents();
  // Stringify and strip newlines to prevent Log Injection vulnerabilities (CWE-117)
  const sanitizedOutput = JSON.stringify(events).replace(/[\r\n]/g, '');
  console.log("Events:", sanitizedOutput);
}

run();
