import https from "node:https";
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

    const baseUrl = process.env.RENDER_COM_BASE_URL;

    if (baseUrl) {
        const getRandomInt = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        setInterval(() => {
            https.get(baseUrl);
        }, 5000 + getRandomInt(500, 1000));
    }
};

export { hostOnRenderCom };
