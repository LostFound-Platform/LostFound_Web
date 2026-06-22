# 🚀 Smart Lost & Found Platform (AI-Powered Full-Stack System)

A full-stack, AI-powered Lost & Found platform built for **Schools in the US** to modernize and automate item recovery workflows using AI, real-time coordination, and secure verification systems.

---

## 🎯 Overview

This project replaces the traditional manual lost-and-found process (physical bins, social media posts) with a **centralized digital system** that enables:

- Intelligent AI-based item matching
- Secure multi-user recovery workflow
- Automated email-based notifications
- Admin analytics & monitoring dashboard

This is designed as a **real-world engineering system**, not a CRUD application.

---

## ❗ Problem Statement

The current system at Discovery High School suffers from:

- Low recovery rate of lost items
- No centralized tracking database
- Manual, inefficient claim process
- Lack of verification between users
- No analytics for administrators

This project solves these issues through **automation, AI, and structured workflows**.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Email verification required for account activation
- Role-based access control (Student / Admin)
- Two-factor authentication using image-based login
- Fraud prevention using unique pickup verification codes

---

### 🔍 AI-Powered Matching System
- OpenAI CLIP image embeddings
- Cosine similarity-based image matching
- Hybrid search (image + metadata filtering)
- Ranked similarity scoring with percentage output
- Personalized AI suggestions (owner-only visibility)

---

### 📬 Notification System
- Email-driven event notification pipeline
- Triggers for:
  - New found item postings
  - AI-matched item detection
  - Admin announcements
  - Pickup status updates
- Supports both image-based and text-based matching alerts

---

### 🤝 Pickup & Claim Workflow
- Multi-step recovery process:
  - “I will pick up” request
  - Schedule negotiation between users
  - Confirmation of meeting time
  - Verification code exchange during handoff
- Dynamic rescheduling system
- Email synchronization for every workflow state change

---

### 📊 Admin Dashboard
- Bar chart: Lost / Found / Returned items
- Pie chart: system distribution overview
- Line chart: inventory trend over time
- Tracks:
  - Recovery rate
  - Item backlog
  - System efficiency metrics

---

### ♿ Accessibility Features
- Voice-controlled navigation using Web Speech API
- Hands-free interaction support
- Accessibility-first UI design

---

## 🏗️ System Architecture

```
Frontend (React + Vite)
↓
REST API (ASP.NET Core .NET 8)
↓
Service / Business Layer
↓
AI Matching Engine (CLIP + Cosine Similarity)
↓
Database (SQL Server)
↓
Email Notification System (SMTP)
```

---

## ☁️ Deployment

- Hosted on Microsoft Azure
- Optimized for:
  - High concurrency handling
  - Async email processing
  - Scalable API architecture

---

## 🧠 Tech Stack

### Frontend
- React.js (Vite)
- Web Speech API

### Backend
- ASP.NET Core (.NET 8)
- SignalR (real-time updates)
- JWT Authentication

### AI / Matching
- OpenAI CLIP embeddings
- Cosine similarity engine

### Database
- SQL Server

### Cloud
- Microsoft Azure

---

## 🔥 Engineering Highlights

- Designed a **multi-user state-driven workflow system**
- Built **AI-powered multimodal search engine**
- Implemented **event-driven email notification architecture**
- Solved real-world constraint: no push notifications → email-based system design
- Created **fraud-resistant verification system**
- Integrated AI + workflow + security + analytics into a unified platform

---

## 📈 Impact

- Improved item recovery efficiency through AI matching
- Reduced manual workload for school staff
- Increased transparency between users
- Enabled secure real-world item handoff
- Provided actionable analytics for administrators

---

## 🧩 Future Improvements

- WebSocket-based push notification system
- Vector database integration (FAISS / Pinecone)
- Location-based matching system
- AI ranking model optimization
- Mobile-first redesign

---

## 🤝 Contributing

We welcome passionate students, builders, and aspiring contributors who want to grow with the project.

To maintain quality and ensure the right fit, contributors join through a structured pathway rather than direct public pull requests.

### Contributor Pathway

**Application Form → Conversation / Interview → Trial Task or Internship Stage → Contributor → Lead**

### Process Overview

1. **Application Form**
   Submit the application form to express your interest and share your background, skills, and preferred role.

2. **Conversation / Interview**
   Shortlisted applicants will be invited to a conversation or interview to discuss experience, goals, communication, and team fit.

3. **Trial Task / Internship Stage**
   Applicants may complete a trial task or participate in a short internship-style evaluation period to demonstrate technical ability, collaboration, and ownership.

4. **Contributor**
   Candidates who successfully complete the evaluation stage may join the project as contributors.

5. **Lead**
   Contributors who consistently show strong performance, initiative, communication, and impact may be considered for lead roles based on their level and readiness.

> **Note:** We currently do not accept direct unsolicited pull requests. If you’d like to contribute, please start with the application process.

### If you are already a contributor and want to contribute to this React + Vite project:

1. **Fork the repository**
2. **Clone your fork**

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

3. **Install dependencies**

```bash
npm install
```

4. **Create a new feature branch**

```bash
git checkout -b feature/new-feature
```

5. **Start the development server and make your changes**

```bash
npm run dev
```

6. **Commit your changes**

```bash
git commit -m "feat: add new feature"
```

7. **Push your branch**

```bash
git push origin feature/new-feature
```

8. **Open a Pull Request**

---

⭐ If you found this project useful, consider giving it a star.
