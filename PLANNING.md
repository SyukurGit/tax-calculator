# Bagian A: Perencanaan Perubahan (Agile Planning: Epics & User Stories)

Dalam tahap perencanaan proyek modernisasi aplikasi **Kalkulator Pajak (Tax Calculator)**, berikut adalah rincian **Epic** dan **User Stories** yang dibuat pada papan Agile (GitHub Issues / ZenHub):

---

## 📌 1. Epic Overview

* **Epic Title:** `[EPIC] Modernize Tax Calculator Application & Automate CI/CD Pipeline`
* **Deskripsi:**  
  Modernisasi aplikasi monolitik/legacy Kalkulator Pajak menjadi aplikasi cloud-native berbasis kontainer Docker, menyiapkan automated test framework (Jasmine), dan membangun pipeline otomasi CI/CD menggunakan Tekton Pipelines untuk deployment otomatis ke IBM Cloud Kubernetes Service / OpenShift.
* **Scope:**
  - Modernisasi & Containerization (Docker, IBM Cloud Container Registry)
  - Pengujian Otomatis (Jasmine Unit Testing)
  - Otomasi DevOps (Tekton Tasks, Pipelines, dan PipelineRun)

---

## 📋 2. User Stories

### Story 1: Automated Unit Testing Framework
* **Judul:** `User Story 1: Introduce Jasmine Unit Tests for Tax Calculation Logic`
* **Deskripsi:**  
  *Sebagai* Pengembang Aplikasi (Developer),  
  *Saya ingin* mengimplementasikan unit test otomatis menggunakan Jasmine untuk memvalidasi bracket pajak, deduksi, dan formatting,  
  *Agar* setiap perubahan logika perhitungan pajak terverifikasi secara akurat tanpa regresi.
* **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Konfigurasi `spec/support/jasmine.json` dan `package.json` dengan script `"test": "jasmine"`.
  - [x] Pengujian mencakup status Single, Married, Head of Household, deduksi, zero income, dan batas bracket.
  - [x] Perintah `npm test` menghasilkan 100% lulus (0 failures).

---

### Story 2: Application Containerization
* **Judul:** `User Story 2: Containerize Tax Calculator Web Application Using Docker`
* **Deskripsi:**  
  *Sebagai* DevOps Engineer,  
  *Saya ingin* membuat Dockerfile efisien berbasis Node.js Alpine untuk aplikasi Kalkulator Pajak,  
  *Agar* aplikasi dapat dijalankan secara konsisten di lingkungan lokal pengembang maupun di container cluster.
* **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] `Dockerfile` dibuat menggunakan base image `node:18-alpine` dengan konfigurasi multi-stage / lean production.
  - [x] Port `8080` diekspos dan dilengkapi health check.
  - [x] Docker image berhasil dibangun dengan tag `tax-calculator:v1` dan berjalan di container lokal.

---

### Story 3: Deployment to IBM Cloud Kubernetes
* **Judul:** `User Story 3: Push Image to IBM Cloud Container Registry & Deploy to Cluster`
* **Deskripsi:**  
  *Sebagai* Cloud Administrator,  
  *Saya ingin* mendorong image kontainer ke IBM Cloud Container Registry (ICR) dan menerapkannya ke Kubernetes/OpenShift menggunakan manifest declarative,  
  *Agar* aplikasi Kalkulator Pajak dapat diakses secara publik dan memiliki ketersediaan tinggi (high availability).
* **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Image ditandai (tagged) dengan URL registri ICR: `us.icr.io/<namespace>/tax-calculator:v1`.
  - [x] Image berhasil di-push ke ICR.
  - [x] Manifest `k8s/deployment.yaml` (2 replika) dan `k8s/service.yaml` (NodePort/LoadBalancer) diterapkan ke cluster.

---

### Story 4: Tekton CI/CD Pipeline Automation
* **Judul:** `User Story 4: Implement Tekton CI/CD Pipeline for Continuous Integration & Deployment`
* **Deskripsi:**  
  *Sebagai* Release Engineer,  
  *Saya ingin* merancang dan menjalankan Tekton Pipeline yang secara otomatis mengklon kode, menginstal dependensi, menjalankan unit test Jasmine, membangun kontainer, dan mendeploy ke cluster,  
  *Agar* siklus deployment aplikasi berjalan otomatis, aman, dan tanpa intervensi manual.
* **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Dibuat reusable Tekton Tasks: `npminstall`, `tests`, `buildah`, `deploy`.
  - [x] Pipeline `tax-calculator-pipeline` menghubungkan task secara sekuensial dengan dependency `runAfter`.
  - [x] `PipelineRun` dieksekusi dan seluruh tahapan pipeline berstatus `Succeeded`.
