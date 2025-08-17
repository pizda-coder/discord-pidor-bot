import express from "express";

import { logger } from "@/logging";

const hostOnRenderCom = () => {
    const app = express();
    const port = process.env.PORT || 3000;

    app.get("/", (request, response) => {
        response.send(`Hello, user! Your IP is: ${request.ip ?? "<unknown>"}`);
    });

    app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
    });
};

export { hostOnRenderCom };
