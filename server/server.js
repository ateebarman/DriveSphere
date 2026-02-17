import app, { connectToDatabase } from "./app.js";

// Start Server
connectToDatabase().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
  });
});
