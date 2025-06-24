# 🧾 TODOS - Assessment Platform Backend

## ✅ Completed
- Auth (Register/Login with JWT)
- Role-based access control middleware
- Create & publish assessments
- Add sections & questions
- Start & submit assessment attempts
- Auto-evaluation for MCQ attempts
- View attempts by candidate or ID
---

## 🧠 Assessment Logic
- [x] `GET /api/assessments/available` – Candidate sees only active/published
- [x] `GET /api/attempts/assessment/:assessmentId` – Full test fetch for candidate
- [ ] Shuffle/randomize question order (optional)
- [ ] Section-wise timers (future)
- [ ] Retake restriction logic

## 👥 User & Group Features
- [x] Group model: `name`, `trainerId`, `members[]`
- [ ] Assign candidates to groups
- [ ] Assign assessments to groups
- [ ] Fetch assessments by group

## 🧪 Attempt Logic
- [ ] Prevent multiple attempts per assessment per candidate
- [ ] Enforce assessment timing: no start before `startTime`, no submit after `endTime`
- [ ] `GET /api/attempts/results/:candidateId` – Full scorecard view
- [ ] Attempt resume logic (store in-progress state)

## 📊 Analytics & Reporting
- [ ] `GET /api/analytics/assessment/:id` – Trainer/Admin dashboard
- [ ] Per-question and per-section breakdown
- [ ] Accuracy % and average score calculations
- [ ] Export data (CSV/PDF optional)

## 📦 Question Management
- [ ] Bulk upload via CSV/JSON
- [ ] Upload image-based pseudo code questions
- [ ] Filter questions by tags/difficulty/topic
- [ ] Use Cloudinary for image upload

## 🔐 Security & Validation
- [ ] bcrypt password hashing
- [ ] Input validation (`express-validator` or `zod`)
- [ ] Rate limiter on auth routes
- [ ] Hide `correctAnswers` in question fetch
- [ ] Tab switch count tracking (for proctoring)

## 🔮 Optional Future Enhancements
- [ ] Live proctoring dashboard for trainers/admins
- [ ] Issue certificate based on results