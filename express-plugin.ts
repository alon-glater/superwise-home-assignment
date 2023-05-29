/* 
  Credit for the following plugin configuration goes to:
  https://noam.hashnode.dev/using-vite-to-serve-and-hot-reload-react-app-express-api-together
*/

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function express(path: string) {
  return {
    name: "express-plugin",
    configureServer: async (server: any) => {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        process.env["VITE"] = "true";
        try {
          const { app } = await server.ssrLoadModule(path);
          app(req, res, next);
        } catch (err) {
          console.error(err);
        }
      });
    },
  };
}
