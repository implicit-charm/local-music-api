import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { getAudioFiles } from "./lib/getAudioFiles";

const app = new Hono();

app.use("*", serveStatic({ root: "./public" }));

app.get("/", (c) => c.redirect("/public/index.html"));

app.get("/api/musics", (c) => {
  try {
    const baseUrl = new URL(c.req.url).origin;
    const audioFiles = getAudioFiles().map((file: any) => {
      return {
        name: file.name,
        src: `${baseUrl}${file.relativePath}`,
        lrc: file.lrcRelativePath ? `${baseUrl}${file.lrcRelativePath}` : "",
        size: file.size,
      };
    });
    return c.json({ files: audioFiles });
  } catch (error) {
    console.error("Failed to get audio files:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

const port = Number(process.env.PORT) || 3000;
const ServeOptions = {
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
};

serve(ServeOptions, () => {
  console.log(`Server running on http://localhost:${port}`);
});
