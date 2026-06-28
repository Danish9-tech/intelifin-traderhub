import { buildApp } from "./app";

const port = Number(process.env.PORT || 4000);

buildApp()
  .then(({ app }) => {
    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API server", error);
    process.exit(1);
  });
