if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("pg-patch").run({
  patchDir: "src/infrastructure/db/migrations",
  client: process.env.DATABASE_URL,
});
