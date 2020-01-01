// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

const fs = require("fs"),
  filename = process.argv[2];
const quotes = JSON.parse(fs.readFileSync(filename, "utf8"));

const feed = {};

quotes.forEach(el => {
  const quote = el.quote;
  const words = quote
    .split("")
    .map(it => (it >= "A" && it <= "Z" ? " " + it.toLowerCase() : it))
    .join("")
    .replace(/[^a-z0-9']+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
  for (let i = 0; i < words.length - 1; i++) {
    const left = words[i];
    const right = words[i + 1];
    const value = feed[left] || [];
    value.push(right);
    feed[left] = value;
  }
  const last = words[words.length - 1];
  const value = feed[last] || [];
  value.push("");
  feed[last] = value;
});

fs.writeFile("feed.json", JSON.stringify(feed, null, 2), function(err) {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});
