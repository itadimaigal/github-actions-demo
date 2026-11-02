import http from "node:http";
import { pathToFileURL } from "node:url";
import { cartTotal, formatINR } from "./cart.js";

const VERSION = process.env.APP_VERSION || "dev";

export function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const send = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };
    if (url.pathname === "/health") {
      return send(200, { status: "ok", version: VERSION });
    }
    if (url.pathname === "/total") {
      // /total?prices=100,250&sale=0,1&premium=true
      const prices = (url.searchParams.get("prices") || "").split(",").filter(Boolean).map(Number);
      const sale = (url.searchParams.get("sale") || "").split(",");
      if (prices.some(Number.isNaN)) return send(400, { error: "prices must be numbers" });
      const items = prices.map((price, i) => ({ price, onSale: sale[i] === "1" }));
      const total = cartTotal(items, url.searchParams.get("premium") === "true");
      return send(200, { total, display: formatINR(total) });
    }
    send(404, { error: "not found" });
  });
}

// Start listening only when run directly (node src/server.js), not when imported by tests.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => console.log(`Listening on http://localhost:${port} (version ${VERSION})`));
}
