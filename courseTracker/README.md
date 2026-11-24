# Course Registration Tracker

A browser-based college micro-project for student course registration, faculty approval, and academic credit and fee tracking. It runs with HTML, CSS, and vanilla JavaScript.

## Run locally

- **VS Code Live Server:** Open the project folder in VS Code, right-click `index.html`, and choose **Open with Live Server**.
- **Directly in a browser:** Open `index.html` in Chrome or Edge. If your browser restricts storage for local files, use Live Server.
- **Optional Python server:** Run `python -m http.server 8000 --bind 127.0.0.1` in the project folder and open `http://127.0.0.1:8000/`.

No packages, build step, or external services are required.

## Demo accounts

| Portal | Enrollment number or faculty ID | Password |
| --- | --- | --- |
| Student Login | `CRT2026001` | `Student@123` |
| Faculty Login | `FAC2026001` | `Faculty@123` |

Choose **Student Login** or **Faculty Login** and enter the corresponding credentials. Each login screen also has a demo sign-in button. You can create a student account and reset its password using the enrollment number and email on the account.

## Try the student workflow

1. Open **Course Catalog**. Search for **Statistical Techniques** or filter for **Semester 2** and **Open for registration**.
2. Select **View Details**, then **Register for Course**. Use **Review Selection** to see the course and credit total. Add **Discrete Structures** to try a multi-course submission.
3. Select **Review registration** and **Confirm registration**. Check that the newly submitted courses appear as **Pending** in **My Registrations**. Reload the page to see the saved history.
4. Reopen a submitted course in the catalog to check that another registration is blocked.
5. Visit **Credit Tracker**. The demo starts with 11 registered credits and 3 earned credits. In **My Registrations**, use **Mark complete** on the demo's approved **Programming in C** record to raise earned credits to 7. Pending and approved registrations count toward registered credits. Earned credits count toward the 120-credit programme target when an approved course is marked complete.
6. Visit **Fee Tracker** to see the fictional annual tuition balance and payment history. Update your details in **My Profile** and use **Log out** to return to the landing page.

The demo starts with Pending, Approved, and Rejected records. New submissions start as Pending. Tuition and payment history are fictional and tracked separately from registrations.

## Review a registration as faculty

1. Submit a course as a student, then log out. Choose **Faculty Login** and sign in using the faculty demo account.
2. In **Registration Requests**, search for the student's name or enrollment number. Filter by **Pending** to find requests that need a decision. Choose **Approve** or **Reject** on the request.
3. Use **Student Roster** to find students with approved, pending, rejected, or no submissions. Pick a course to see the counts and participation for that course.
4. Once an approved course is successfully completed, use **Mark complete**. The student can see the decision in **My Registrations** and the earned credits in **Credit Tracker**.
5. Select **Add course** from **Registration Requests** or **Manage Courses**. Save the course to add it to the student catalog. Use **Edit course** in **Manage Courses** to update details, credits, or registration availability. Credit changes apply to future submissions. Existing registration records retain the credits recorded when they were submitted.

## Local data

Accounts, sessions, course edits, selections, and registrations are saved in LocalStorage for the current browser profile and URL origin. Use the same browser profile and site address for both roles. Live Server and a directly opened file use different storage. The faculty login is for classroom demonstration. Use fictional profile information and passwords. To restore the original sample data, remove the `course-tracker.v1` key from LocalStorage in browser developer tools and reload. This removes local changes made in that browser at that URL.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page shell and script entry points |
| `css/styles.css` | Responsive layout, styling, and interaction states |
| `js/data.js` | Sample course catalog, demo student, and tuition records |
| `js/store.js` | LocalStorage, accounts, registration, and calculations |
| `js/views.js` | Landing page, authentication, portal pages, and course details |
| `js/faculty.js` | Faculty sign-in, registration requests, student roster, and course editor |
| `js/app.js` | Navigation, forms, filters, dialogs, and notifications |
| `assets/campus.webp` | Generated campus photograph |
