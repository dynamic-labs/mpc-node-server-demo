import express from "express";
import { registerMiddleware } from "./handlers/middleware/registerMiddleware";
import logger from "./logger";
import path from "path";

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/loadforge.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "loadforge.txt"));
});

registerMiddleware(app);

const port = process.env.PORT || 8010; // Use Heroku's PORT or default to 8010

if (process.env.NODE_ENV !== "test") {
  const server = app.listen(port, () => {
    logger.info("Express started on port 8010");
  });
  server.setTimeout(10000); // 10 seconds
}

export default app;
