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

Commit and push the reviewed manifests to a Git repository, then configure an Argo CD Application to track the repository and the `k8s/` path. The namespace manifest can be applied by Argo CD when configured to create the destination namespace, or applied beforehand. Keep credentials out of Git and provide production secrets through an approved secret-management workflow.

The local file `k8s/backend/secret.yaml` is a dummy demonstration Secret and is excluded by `.gitignore`. Apply the listed manifests individually; do not apply the entire `k8s/backend` directory, which contains that local demo file. The backend ConfigMap currently contains a non-authenticated local MongoDB URI; production authentication still needs to be implemented before using this configuration for a protected deployment.

## Kubernetes manifest inventory

- `k8s/namespace.yaml` — `student-management` namespace
- `k8s/mongodb/pvc.yaml`, `service.yaml`, `statefulset.yaml` — persistent MongoDB storage and workload
- `k8s/backend/configmap.yaml`, `deployment.yaml`, `service.yaml` — backend configuration and workload
- `k8s/frontend/deployment.yaml`, `service.yaml` — frontend workload and NodePort access
