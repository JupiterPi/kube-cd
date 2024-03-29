import * as fs from "fs";
import * as path from "path";
import express from "express";
import * as bodyParser from "body-parser";
import {kubectlApply} from "./kubectl-apply";

const port = process.env["PORT"] ?? 80;
// where pushed Kubernetes configuration will be stored
const root = process.env["KUBE_CD_FILES"] ?? "files";
// auth token passed by clients on push, needs to be of form "token:***" or "file:***" (file must not contain a newline)
const authTokenEnv = process.env["KUBE_CD_AUTH_TOKEN"] ?? "file:auth_token";
const authToken = authTokenEnv.startsWith("token:")
    ? authTokenEnv.substring("token:".length)
    : fs.readFileSync(authTokenEnv.substring("file:".length)).toString();

const app = express();
app.use(bodyParser.text());
app.post("/applyKubernetesResource/:file", async (req, res) => {
    if ((req.headers.authorization ?? "").split(" ")[1] !== authToken) {
        res.status(401).send("Authentication required");
        return;
    }

    const fileName = req.params.file;
    const file = req.body;

    const logsPath = path.join(root, "default");
    if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath, {recursive: true});
    fs.writeFileSync(path.join(logsPath, fileName), file);
    await kubectlApply(path.join(logsPath, fileName));
    res.send("Applied");
});

app.listen(port, () => {
    console.log(`kube-cd listening on port ${port}`);
});