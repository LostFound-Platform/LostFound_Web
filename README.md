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

The current system at schools suffers from:

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
- Vector database integration
- Location-based matching system
- AI ranking model optimization
- Mobile-first redesign

---

⭐ If you found this project useful, consider giving it a star.
