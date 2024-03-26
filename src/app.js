const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const childProcess = require("child_process");

const port = process.env["PORT"] ?? 80;
const path = process.env["KUBE_CD_PATH"] ?? "files";

const app = express();
app.use(bodyParser.text());
app.post("/applyKubernetesConfiguration/:file", (req, res) => {
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