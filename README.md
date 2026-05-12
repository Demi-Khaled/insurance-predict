# InsurePredict AI - AWS Deployment Documentation

This document outlines the architecture and steps used to deploy the **InsurePredict AI** platform on AWS.

## 🏗️ Architecture Overview

The system is split into three main tiers, integrated via a custom VPC:

| Component | Technology | AWS Service |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | **S3 Static Hosting** |
| **Backend API** | Node.js (Express) | **EC2 Instance (t2.micro)** |
| **AI Inference** | Python (FastAPI + SVM) | **ECS Fargate** |
| **Database** | MySQL | **RDS (Managed)** |
| **Storage** | Object Storage | **S3 Buckets** |
| **Container Registry** | Docker Images | **Amazon ECR** |

---

## 🚀 Deployment Steps

### 1. Database Setup (RDS)
1.  **Instance Creation**: Provisioned a MySQL RDS instance (`db.t3.micro`).
2.  **Connectivity**: Configured Security Groups to allow inbound traffic on port `3306` from the Backend EC2 instance.
3.  **Schema Migration**: 
    *   Updated `DATABASE_URL` in `backend/.env`.
    *   Executed `npx prisma db push` to initialize the database schema.

### 2. AI Service Deployment (ECS Fargate)
1.  **Dockerize**: Built the AI container using the `ai-service/Dockerfile`.
2.  **ECR Registry**: Created a repository in Amazon ECR and pushed the image.
3.  **ECS Cluster**: Created a Fargate cluster and a Task Definition.
4.  **Networking**: Enabled **Service Discovery** (AWS Cloud Map) to allow the backend to communicate with the AI service via `http://ai-service:8000`.

### 3. Backend Deployment (EC2)
1.  **Host Setup**: Launched an EC2 instance and installed Node.js and PM2.
2.  **Process Management**: Used **PM2** to manage the Node.js process:
    ```bash
    pm2 start index.js --name "insure-backend"
    pm2 save
    pm2 startup
    ```
3.  **Security**: Opened port `3000` in the EC2 Security Group for API access.

### 4. Frontend Deployment (S3)
1.  **API Integration**: Pointed `VITE_API_URL` to the EC2 Public IP address.
2.  **Build**: Generated production assets using `npm run build`.
3.  **Static Hosting**: Uploaded the `dist/` folder to an S3 bucket with "Static Web Hosting" enabled and a public read policy.

---

## 🔐 Environment Configuration

### Backend (`.env`)
*   `DATABASE_URL`: `mysql://admin:<password>@<rds-endpoint>:3306/insurepredict`
*   `AI_SERVICE_URL`: `http://ai-service:8000/predict`
*   `JWT_SECRET`: Used for secure user authentication.

### Frontend (`.env`)
*   `VITE_API_URL`: `http://<ec2-public-ip>:3000/api`

---

## 🛠️ Maintenance & Monitoring
*   **Logs**: View backend logs via `pm2 logs`.
*   **AI Health**: Monitor ECS container health through the AWS Console.
*   **Scaling**: The AI service can be scaled horizontally by increasing the "Desired Tasks" in the ECS Service.
