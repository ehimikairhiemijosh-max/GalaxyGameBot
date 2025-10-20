import express from "express";
import axios from "axios";
import { Telegraf } from "telegraf";

const app = express();
const BOT_TOKEN = "8325129853:AAGIZM0ygJkaCQJ93iB4xGZTrXVEuutGTcM";
const BLOG_FEED = "https://gamingverse01.blogspot.com/feeds/posts/default?alt=json";

const bot = new Telegraf(BOT_TOKEN);

// 🕹️ Bot Command
bot.start((ctx) => ctx.reply("🎮 Welcome to 𝙂𝘼𝙈𝙀 𝗩𝗘𝗥𝗦𝗘™ Bot! Type any game name to search."));

bot.on("text", async (ctx) => {
  const query = ctx.message.text.toLowerCase();
  try {
    const { data } = await axios.get(BLOG_FEED);
    const posts = data.feed.entry.filter((entry) =>
      entry.title.$t.toLowerCase().includes(query)
    );

    if (posts.length === 0) {
      return ctx.reply("❌ No game found with that name.");
    }

    posts.forEach((post) => {
      const title = post.title.$t;
      const link = post.link.find((l) => l.rel === "alternate").href;
      const desc = post.summary.$t.slice(0, 200) + "...";
      ctx.reply(`🎮 *${title}*\n\n${desc}\n🔗 [Read more](${link})`, {
        parse_mode: "Markdown",
      });
    });
  } catch (error) {
    ctx.reply("⚠️ Something went wrong. Try again later.");
  }
});

bot.launch();

app.get("/", (req, res) => res.send("GalaxyGameBot is running 🚀"));
app.listen(10000, () => console.log("Server started on port 10000"));
