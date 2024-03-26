# kube-cd

Simple Continuous Delivery for Kubernetes. 


## Usage

1. Install on a machine with `kubectl` installed where it accesses your desired Kubernetes cluster.
2. Run via `npm start`. You can specify the port and where Kubernetes configuration files are stored with the `PORT` and `KUBE_CD_PATH` environment variables.
3. Push any Kubernetes configuration file to your cluster by calling `POST /applyKubernetesConfiguration/my_resource.yaml` (any file name). Behind the scenes, kube-cd will call `kubernetes apply -f my_resource.yaml`.

**Warning!** This is not meant for production use, and it is completely unsecured!
