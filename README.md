# kube-cd

Simple Continuous Delivery for Kubernetes. 


## Usage

### Installation

1. Install on a machine with `kubectl` installed, where it accesses your desired Kubernetes cluster.
2. Optionally specify the port with the `PORT` environment variable (default is 80).
3. Optionally specify where Kubernetes resource files will be stored with the `KUBE_CD_FILES` environment variable (default is the `files` subdirectory).
4. Optionally specify the (single) authentication token with the `KUBE_CD_AUTH_TOKEN` environment variable: either `token:<...>` or `file:<...>` (default is `file:auth_token`).

You can also install kube-cd inside your Kubernetes cluster. See `./Dockerfile`, `./kubernetes/kube-cd.yaml`. 

### Usage

1. Run via `npm start`.
2. Push any Kubernetes resource file to your cluster by calling `POST /applyKubernetesResource/my_resource.yaml` (any file name). Pass the authentication token on the `Authorization` header as `Bearer <...>`. Pass the content of your Kubernetes resource file as text in the request body. 
3. Behind the scenes, kube-cd will then call `kubernetes apply -f my_resource.yaml`.

**Warning!** This is not meant for production use! Evaluate security independently. 
