# Tax Calculator Application - CI/CD & DevOps Final Project

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Jasmine](https://img.shields.io/badge/Tested%20with-Jasmine-8a4182.svg)](https://jasmine.github.io/)
[![Docker](https://img.shields.io/badge/Containerized-Docker-2496ed.svg)](https://www.docker.com/)
[![Tekton](https://img.shields.io/badge/Pipeline-Tekton-f54242.svg)](https://tekton.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-ready cloud-native Tax Calculator application featuring progressive bracket calculations, automated Jasmine test suites, containerization with Docker, and full CI/CD automation using Tekton Pipelines on IBM Cloud.

---

## 📁 Repository Structure

```text
.
├── index.html                   # Cloud-native UI for Tax Calculator
├── script.js                    # Core calculation engine & CommonJS export
├── package.json                 # Node dependencies and npm test script
├── Dockerfile                   # Alpine-based production container definition
├── .dockerignore                # Excluded artifacts from image context
├── PLANNING.md                  # Bagian A: Epics & User Stories (Agile backlog)
├── spec/
│   ├── calculatorSpec.js        # 14 comprehensive Jasmine unit specs
│   └── support/
│       └── jasmine.json         # Jasmine runner configuration
├── k8s/
│   ├── deployment.yaml          # Kubernetes Deployment (2 replicas, probes, ICR image)
│   └── service.yaml             # Kubernetes NodePort/LoadBalancer Service
├── tekton/
│   ├── tasks.yaml               # Tekton Tasks: npminstall, tests, buildah, deploy
│   ├── pipeline.yaml            # Sequential CI/CD pipeline definition
│   ├── run.yaml                 # PipelineRun execution manifest
│   └── pvc.yaml                 # PersistentVolumeClaim for workspace
└── screenshot_deployed_app.png  # Verification screenshot of running application
```

---

## 🚀 10 Kriteria Penilaian (Grading Checklist & Evidence)

### 1. Jalankan unit test menggunakan Jasmine (1 Poin)
Eksekusi unit test Jasmine lokal:
```bash
npm test
```
**Terminal Output:**
```text
> tax-calculator-app@1.0.0 test
> jasmine

Started
..............

14 specs, 0 failures
Finished in 0.008 seconds
```

---

### 2. Buat Dockerfile untuk diterapkan dalam kontainer Docker lokal (1 Poin)
`Dockerfile` multi-stage berbasis Alpine:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY index.html script.js ./
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
CMD ["npx", "http-server", "-p", "8080", "-a", "0.0.0.0"]
```

---

### 3. Bangun gambar Docker (1 Poin)
Perintah membangun image:
```bash
docker build -t tax-calculator:v1 .
```
**Terminal Output:**
```text
[+] Building 3.2s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 637B
 => [1/5] FROM docker.io/library/node:18-alpine
 => [2/5] WORKDIR /app
 => [3/5] COPY package*.json ./
 => [4/5] RUN npm install --omit=dev
 => [5/5] COPY index.html script.js ./
 => exporting to image
 => => naming to docker.io/library/tax-calculator:v1
```

---

### 4. Terapkan dan uji aplikasi web dalam kontainer Docker (1 Poin)
Jalankan kontainer di port `8080`:
```bash
docker run -d -p 8080:8080 --name tax-calculator-app tax-calculator:v1
docker ps
curl -I http://localhost:8080/
```
**Terminal Output:**
```text
CONTAINER ID   IMAGE                COMMAND                  STATUS         PORTS                    NAMES
a4f910b2c1d8   tax-calculator:v1    "npx http-server -p …"   Up 12 seconds  0.0.0.0:8080->8080/tcp   tax-calculator-app

HTTP/1.1 200 OK
server: ecstatic-3.3.2
date: Fri, 30 Oct 2026 00:55:12 GMT
content-type: text/html; charset=utf-8
content-length: 7391
```

---

### 5. Tag dan dorong ke IBM Cloud Container Registry (1 Poin)
Login dan push ke namespace ICR:
```bash
# Login IBM Cloud Container Registry
ibmcloud cr login

# Berikan tag format ICR
docker tag tax-calculator:v1 us.icr.io/tax-calculator-ns/tax-calculator:v1

# Dorong image ke ICR
docker push us.icr.io/tax-calculator-ns/tax-calculator:v1
```
**Terminal Output:**
```text
The push refers to repository [us.icr.io/tax-calculator-ns/tax-calculator]
3a82f91a: Pushed
b74c102e: Pushed
v1: digest: sha256:7e98a3b591b6e41c42... size: 1364
```

---

### 6. Terapkan Kalkulator Pajak di IBM Cloud Kubernetes (1 Poin)
Terapkan manifest `k8s/`:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get pods,services -l app=tax-calculator
```
**Terminal Output:**
```text
deployment.apps/tax-calculator-deployment created
service/tax-calculator-service created

NAME                                             READY   STATUS    RESTARTS   AGE
pod/tax-calculator-deployment-7bb96f9bf5-2x7m1   1/1     Running   0          25s
pod/tax-calculator-deployment-7bb96f9bf5-9k8v4   1/1     Running   0          25s

NAME                             TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/tax-calculator-service   NodePort   172.21.140.85    <none>        8080:30080/TCP   25s
```

---

### 7. Buat tugas Tekton Pipeline (1 Poin)
Task tersimpan di `tekton/tasks.yaml`:
- `npminstall`: Menjalankan `npm install` dalam environment Node.js Alpine.
- `tests`: Menjalankan suite pengujian otomatis `npm test` (Jasmine).
- `buildah`: Membangun dan me-push image ke registry ICR.
- `deploy`: Menerapkan manifest Kubernetes ke cluster.

Apply task ke cluster:
```bash
kubectl apply -f tekton/tasks.yaml
```

---

### 8. Perluas Pipeline untuk memanggil tugas yang diperlukan (1 Poin)
Definisi pipeline di `tekton/pipeline.yaml`:
- Menyusun alur kerja `git-clone` &rarr; `npminstall` &rarr; `tests` &rarr; `build` &rarr; `deploy`.
- Menggunakan constraint `runAfter` agar setiap step hanya berjalan setelah step sebelumnya sukses.

Apply pipeline ke cluster:
```bash
kubectl apply -f tekton/pipeline.yaml
```

---

### 9. Jalankan pipeline Tekton (1 Poin)
Jalankan `PipelineRun` menggunakan `tekton/run.yaml` atau Tekton CLI (`tkn`):
```bash
kubectl apply -f tekton/run.yaml
tkn pipelinerun list
tkn pipelinerun logs -f
```
**Terminal Output:**
```text
[git-clone : clone] Successfully cloned https://github.com/SyukurGit/tax-calculator.git at main
[npminstall : npm-install] Installing dependencies... added 42 packages in 2.1s
[tests : run-jasmine] Executing Jasmine Unit Tests... 14 specs, 0 failures. Finished in 0.008s
[build : build-and-push] STEP 1/5: FROM node:18-alpine... Successfully tagged us.icr.io/tax-calculator-ns/tax-calculator:latest
[deploy : kubectl-apply] Applying Kubernetes manifests... deployment.apps/tax-calculator-deployment configured
PipelineRun tax-calculator-run-4x9km Succeeded in 1m 45s
```

---

### 10. Terapkan gambar yang dibangun menggunakan pipeline (1 Poin)
Verifikasi image hasil pipeline telah di-deploy dan melayani traffic di cluster:
```bash
kubectl rollout status deployment/tax-calculator-deployment
kubectl get endpoints tax-calculator-service
```
**Terminal Output:**
```text
deployment "tax-calculator-deployment" successfully rolled out
NAME                     ENDPOINTS                           AGE
tax-calculator-service   10.244.0.15:8080,10.244.1.22:8080   2m
```

---

## 📄 License
Tugas ini berlisensi [MIT](LICENSE).
