import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "node:path";
import { hostname } from "node:os";

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static("public"));
app.use("/uv/", express.static(uvPath));
app.use((req, res) => {
  const url = req.url.substring(1); // Remove the leading '/'

  if (/^https?:\/\//.test(url)) {
    // If the URL starts with http:// or https://, treat it as a valid URL
    res.status(404);
    res.sendFile(join("public", "404.html"));
  } else {
    // Otherwise, treat it as a search query
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    
    // You can choose to either redirect to Google or keep the search functionality
    // For redirection:
    // res.writeHead(307, { 'Location': googleSearchUrl });
    // res.end();
    
    // For keeping the search functionality:
    res.status(200).send(`Searching Google for: ${url}`);
  }
});

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");
if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});
