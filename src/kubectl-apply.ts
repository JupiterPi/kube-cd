// https://github.com/kubernetes-client/javascript/blob/master/examples/typescript/apply/apply-example.ts

import {promises as fs} from "fs";
import * as k8s from "@kubernetes/client-node";
import * as yaml from "js-yaml";

export async function kubectlApply(file: string) {
    const kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromDefault();
    console.log(kubeConfig);
    const client = k8s.KubernetesObjectApi.makeApiClient(kubeConfig);

    const specs = (yaml.loadAll(await fs.readFile(file, 'utf8')) as any)
        .filter(spec => spec && spec.kind && spec.metadata);
    for (const spec of specs) {
        spec.metadata = spec.metadata || {};
        spec.metadata.annotations = spec.metadata.annotations || {};
        delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
        spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);
        try {
            await client.read(spec); // if it doesn't exist, it will be created in the catch block
            console.log(await client.patch(spec));
        } catch (e) {
            console.log(await client.create(spec));
        }
    }
}