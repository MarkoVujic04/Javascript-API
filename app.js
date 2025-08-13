import express from "express";

import { PORT } from './config/env.js'

const app = express();

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

export default app;