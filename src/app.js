const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const childProcess = require("child_process");

const port = process.env["PORT"] ?? 80;
// where pushed Kubernetes configuration will be stored
const path = process.env["KUBE_CD_PATH"] ?? "files";
// auth token passed by clients on push, needs to be of form "token:***" or "file:***" (file must not contain a newline)
const authTokenEnv = process.env["KUBE_CD_AUTH_TOKEN"] ?? "file:auth_token";
const authToken = authTokenEnv.startsWith("token:")
    ? authTokenEnv.substring("token:".length)
    : fs.readFileSync(authTokenEnv.substring("file:".length)).toString();

const app = express();
app.use(bodyParser.text());
app.post("/applyKubernetesConfiguration/:file", (req, res) => {
    if ((req.headers.authorization ?? "").split(" ")[1] != authToken) {
        res.status(401).send("Authentication required");
        return;
    }

    const fileName = req.params.file;
    const file = req.body;

    if (!fs.existsSync(path)) fs.mkdirSync(path);
    fs.writeFileSync(path + "/" + fileName, file);
    childProcess.execSync("kubectl apply -f \"" + path + "/" + fileName + "\"");
    res.send("Applied");
});

app.listen(port, () => {
    console.log(`kube-cd listening on port ${port}`);
});