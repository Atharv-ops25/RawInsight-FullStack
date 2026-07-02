# RawInsight 🚀 | Full-Stack AI Data Analyst Engine

RawInsight is an automated, enterprise-grade full-stack data cleansing and profiling platform. Built with **Spring Boot 3** and **React (Vite)**, the application allows users to upload raw, dirty CSV datasets, dynamically profiles them for missing values or structural formatting irregularities using advanced pattern matching, and feeds the diagnostics into a local **Ollama (Llama 3.2)** AI model to generate instant, actionable data quality assessments. Users can sanitize anomalies with one click and instantly download a pristine dataset.

---

## ✨ Features

- **Dynamic Data Profiling:** Automatically identifies missing text field markers (`null`, `NA`, `missing`) and blank entries across any row configuration.
- **Pattern Matching Validation:** Uses optimized Regular Expressions (Regex) to catch structural layout drops, such as malformed email addresses and text hidden inside monetary/numeric columns.
- **AI-Powered Assessments:** Integrates locally-hosted LLMs via Spring AI to provide instant executive reports detailing data cleaning steps.
- **Single-Click Imputation:** Fills text voids with baseline text tags and applies default numeric fallback variables automatically.
- **Persistent Operations Ledger:** Every single file analysis pipeline caches structural summary benchmarks safely into a **MySQL** ledger for historic review.
- **Modular Dashboard View:** A high-performance, dark-themed responsive layout with interactive analytical views and slide-out sidebar panels.

---

## 🏗️ Architecture Layout

The repository is built as a unified monorepo for effortless local management and deployment:

```text
RawInsight-FullStack/
├── frontend/             # React (Vite) UI Application + Tailwind CSS Components
│   └── src/components/   # Modular, decoupled UI view widgets
└── backend/              # Spring Boot Java Application (Tomcat on Port 8082)
    ├── model/            # Hibernate Data Persistence Entities
    ├── repository/       # Spring Data JPA Repository Connectors
    └── controller/       # REST Endpoint Gateways & Streaming Pipelines
