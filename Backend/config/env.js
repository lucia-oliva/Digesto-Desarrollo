
export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  FRONT_ORIGINS: (process.env.FRONT_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim()),
};
