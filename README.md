# Labora — Laboratory Registration System

Multi-page Next.js 14 app with MongoDB persistence and API routes for patients, employees, and laboratory services. No dashboard.

## Requirements
- Node.js 18.17+ (Node 20 LTS recommended)
- MongoDB Atlas database or local MongoDB server

## Run locally
1. Extract the ZIP and open the `labora-next` folder in VS Code.
2. Run `npm install`.
3. Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=labora
```

Replace placeholders with your real Atlas connection string. Never commit `.env.local` to GitHub.
4. Run `npm run dev`, then open http://localhost:3000. Pages: `/patients`, `/employees`, `/services`.

## Postman API endpoints
| Method | URL | Purpose |
|---|---|---|
| GET / POST | `http://localhost:3000/api/patients` | List / save patients |
| GET / POST | `http://localhost:3000/api/employees` | List / save employees |
| GET / POST | `http://localhost:3000/api/services` | List / save tests/services |
| GET / POST | `http://localhost:3000/api/tests` | Backwards-compatible alias for services |

For POST: choose **Body → raw → JSON** and add header `Content-Type: application/json`. Sample patient body:
```json
{"patientName":"Ali Khan","gender":"Male","phone":"03001234567","registrationDate":"2026-10-18","service":"Complete Blood Count (CBC)","status":"Pending"}
```
Employee body:
```json
{"employeeName":"Sara Ahmed","phone":"03007654321","jobTitle":"Lab Technician","department":"Hematology","joiningDate":"2026-10-01","employmentStatus":"Active"}
```
Service body:
```json
{"serviceName":"Complete Blood Count (CBC)","category":"Hematology","price":1200,"sampleType":"Blood","status":"Available"}
```
Successful POST returns HTTP 201 and `success: true`; GET returns a `data` array. Missing DB configuration returns a JSON error, not a fake success.

## MongoDB Atlas
- Create a database user and save the password.
- Under Atlas Network Access, allow your current IP for local development. For a temporary demo only, `0.0.0.0/0` permits access from anywhere; use a strong password and understand the risk.
- Replace the URI username/password. URL-encode special characters in passwords (`@` becomes `%40`).
- The `labora` database and collections are created on the first successful insert.

## Netlify deployment
- Push to GitHub and import the repository into Netlify. Build command: `npm run build`. Leave publish directory to the Next.js integration; do not set it to `out`.
- In Site configuration → Environment variables, add `MONGODB_URI` and `MONGODB_DB`. Trigger a new deploy after changing them.
- Test `https://YOUR-SITE.netlify.app/api/patients` with Postman. For 502/504, check Netlify function logs, URI, Atlas network access, and credentials.

## Important
Educational demo only; not production-ready for real medical data. No authentication, authorization, audit logging, or production-grade medical-data safeguards. Use fake data until these are implemented. APIs support create/list only (no update/delete yet).
