
Based on assessment platform design,**roles and responsibilities** for each type of user in this platform:
---

## 👤 **1. Candidate (Student)**

> **Primary role:** Take assessments and view results.

### 🔹 Can Do:

* 🔎 View only **available assessments** (published, within time window, and assigned to them or public)
* 📝 Start an assessment attempt (only once per assessment unless retakes are allowed)
* ✅ Submit answers with MCQs (and later, coding & subjective types)
* 📊 View their own attempt history and scores
* 📥 See detailed result per attempt (correct, incorrect, status, explanation if enabled)
* ⏳ View timers and countdowns during test
* 🚫 Restricted from seeing:

  * Correct answers before submission
  * Other users' attempts
  * Question creation or test setup

---

## 👩‍🏫 **2. Trainer (Teacher / Question Creator)**

> **Primary role:** Create and manage assessments, questions, and monitor assigned candidate responses.

### 🔹 Can Do:

* 🧾 Create and manage **assessments** with:

  * Sections (e.g., Technical, Aptitude, Pseudocode)
  * Time limits, difficulty, proctoring options
  * Candidate **group assignments**
* ❓ Create and manage **questions**:

  * MCQs with multiple correct answers
  * Pseudocode/image-based questions
  * Future support for coding/subjective
* 🧑‍💼 Assign assessments to specific groups (e.g., “CSE 4th Year”, “Batch A”)
* 📈 View analytics of attempts:

  * Per assessment
  * Per candidate (scores, attempt behavior)
  * Section-wise breakdown
* 📤 Bulk upload questions (CSV or UI)
* 👀 View candidate responses (not editable)

---

## 🧑‍💼 **3. Admin (System Owner / Moderator)**

> **Primary role:** Oversee and moderate the platform, manage users, groups, trainers, and see system-wide analytics.

### 🔹 Can Do:

* 👥 Create and manage:

  * Users (candidates, trainers)
  * Groups (e.g., class batches)
  * Bulk user creation with pattern-based credentials
* 🔒 Moderate assessments:

  * Approve or archive trainer-created assessments
  * Toggle visibility, restrict publishing if needed
* 📊 Access **full system analytics**:

  * Attempts across assessments
  * Trainer activities
  * Candidate performance trends
* 📩 Trigger bulk notifications (email/SMS) to users
* 🔍 Audit logs for suspicious behavior (tab switches, timing issues)
* ⚙️ Manage global configs:

  * Retake limits
  * Negative marking rules
  * Enable/disable proctoring

---

## 🔐 Summary Table

| Permission / Action                         | Candidate ✅ | Trainer ✅    | Admin ✅ |
| ------------------------------------------- | ----------- | ------------ | ------- |
| View available assessments                  | ✅           | 🔍 Their own | 🔍 All  |
| Start and submit attempts                   | ✅           | ❌            | ❌       |
| View own results                            | ✅           | ❌            | ❌       |
| Create assessments, sections, questions     | ❌           | ✅            | ✅       |
| Assign assessments to groups                | ❌           | ✅            | ✅       |
| View candidate submissions and analytics    | ❌           | ✅            | ✅       |
| Create/edit users/groups                    | ❌           | ❌            | ✅       |
| Bulk upload credentials                     | ❌           | ❌            | ✅       |
| Manage all platform configs                 | ❌           | ❌            | ✅       |
| Access audit logs and system-wide analytics | ❌           | ❌            | ✅       |

---


---
## ✅ **Full Feature List** (Grouped by Domain)
---

### 🧠 1. **Assessment Management**

* Create assessment (title, description, duration, difficulty, etc.)
* Add multiple **sections** (e.g., Technical, Pseudo Code)
* Add **questions** to sections (MCQ, image-based, etc.)
* Assign assessment to specific candidates or groups
* Set assessment schedule (start time, end time)
* Enable/disable proctoring options (tab switch tracking, etc.)
* Publish/unpublish assessments
* View list of all created assessments

---

### 👥 2. **User Management**

* Register/Login for `admin`, `trainer`, and `candidate`
* Role-based route protection (access control)
* Assign candidates to groups
* View user profile

---

### 🧪 3. **Attempt Management (Candidate Side)**

* View list of **available/published** assessments
* Start an attempt (only once, if within allowed time)
* Fetch full assessment content (sections + questions) when starting
* Answer questions and submit the assessment
* Auto-evaluation of MCQs
* Store attempt response, marks, timestamps
* Prevent multiple attempts
* Mark attempt as submitted or expired
* View own attempt history and result breakdown

---

### 📊 4. **Analytics & Evaluation (Trainer/Admin Side)**

* View all attempts for an assessment
* Section-wise and question-wise performance
* Candidate-wise performance
* Attempt statistics:

  * Total attempts
  * Average score
  * Accuracy % per question
  * Time taken per section
* Group-based filtering (by trainer group or batch)

---

### 📦 5. **Question Management**

* Create individual questions
* Upload bulk questions via CSV/JSON
* Add image-based pseudo code questions
* Filter questions by topic/tag/difficulty
* Edit/delete questions
* Cloudinary integration for question images

---

### 🛡 6. **Security & Integrity**

* Password hashing with bcrypt
* JWT-based protected routes
* Input validation on all routes
* Prevent question data leakage (hide correct answers)
* Tab switch tracking (proctoring)
* Assessment expiry check before submission
* Resume logic on browser reload (future)

---

### 🧰 7. **System Tools / Misc**

* Seed admin/trainer/candidate users
* Export result reports (CSV/PDF) – optional
* Resume assessment in case of tab/browser crash (future)
* Judge0 integration for coding assessments (future)

