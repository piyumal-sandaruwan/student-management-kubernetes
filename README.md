# Student Management System

A beginner-friendly three-tier application for creating, listing, and deleting student records. The repository includes a React frontend, an Express API, MongoDB storage, Docker Compose for local containers, and Kubernetes manifests for deployment to Docker Desktop Kubernetes.

## Technology stack

- Frontend: React and Vite, served by Nginx in the production container
- Backend: Node.js, Express, and Mongoose
- Database: MongoDB
- Containers: Docker and Docker Compose
- Orchestration and GitOps: Kubernetes and Argo CD

## Architecture

```text
Browser
  └── React frontend (Nginx in production)
        └── /api proxy → Express backend
                           └── Mongoose → MongoDB
```

In Docker Compose, the frontend is available on port 3000 and Nginx proxies API requests to the backend service. In Kubernetes, the frontend is exposed on NodePort 30080, its Nginx proxy sends API requests to the `backend` Service, and the backend connects to MongoDB through the `mongodb` Service. MongoDB stores its data in the `mongodb-pvc` claim.

## Local Docker deployment

From the project root, build and start all three services:

```powershell
docker compose up --build -d
docker compose ps
```

Open the frontend at <http://localhost:3000>. Follow service logs with:

```powershell
docker compose logs -f
```

Stop the services while keeping MongoDB data in the named volume:

```powershell
docker compose down
```

Avoid `docker compose down -v` if you want to preserve the local database volume.

## Kubernetes deployment

The manifests are under `k8s/`. The images referenced below must already be available to the Docker Desktop Kubernetes container runtime. The current local-cluster tags are `student-management-backend:v2`, `student-management-frontend:latest`, and `mongo:7`.

Apply the namespace first, then the database storage, Service, and StatefulSet:

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb/pvc.yaml
kubectl apply -f k8s/mongodb/service.yaml
kubectl apply -f k8s/mongodb/statefulset.yaml
```

Apply the backend ConfigMap, Deployment, and Service, followed by the frontend Deployment and Service:

```powershell
kubectl apply -f k8s/backend/configmap.yaml
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
```

Check resources and rollout status:

```powershell
kubectl -n student-management get pods,services,pvc
kubectl -n student-management rollout status statefulset/mongodb
kubectl -n student-management rollout status deployment/backend
kubectl -n student-management rollout status deployment/frontend
```

Open the Kubernetes frontend at <http://localhost:30080>.

### Argo CD / GitOps

The Argo CD Application manifest is `gitops/argocd/application.yaml`. It points to this repository's `main` branch and the `gitops/overlays/production` path. Argo CD cannot load that path until the GitOps files are committed and pushed. Automated sync, pruning, and self-healing are disabled. Before a manual sync, inspect `argocd app diff student-management`; the overlay includes MongoDB StatefulSet and PVC resources, so confirm their diff is safe and preserves the existing claim and data.

Keep credentials out of Git and use an approved secret-management workflow for production. The local placeholder file `k8s/backend/secret.example.yaml` is excluded by `.gitignore` and is not part of the Kustomize base. Do not apply the entire `k8s/backend` directory: it could apply the placeholder Secret over an existing Secret with the same name. The backend currently reads a non-authenticated in-cluster MongoDB URI from its ConfigMap; production database authentication still needs a secret-management design before using this configuration for a protected deployment.

## Kubernetes manifest inventory

- `k8s/namespace.yaml` — `student-management` namespace
- `k8s/mongodb/pvc.yaml`, `service.yaml`, `statefulset.yaml` — persistent MongoDB storage and workload
- `k8s/backend/configmap.yaml`, `deployment.yaml`, `service.yaml` — backend configuration and workload
- `k8s/frontend/deployment.yaml`, `service.yaml` — frontend workload and NodePort access
