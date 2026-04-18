import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/libs/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
