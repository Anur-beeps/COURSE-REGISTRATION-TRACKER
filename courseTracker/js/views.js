'use strict';

const paths = {
  cap: 'M2 9l10-5 10 5-10 5L2 9z M6 11v5c3 3 9 3 12 0v-5 M22 9v6',
  home: 'M3 10l9-7 9 7v10H3z M9 20v-6h6v6',
  book: 'M4 5a3 3 0 0 1 3-3h13v20H7a3 3 0 0 1 0-6h13 M4 5v14 M8 7h8 M8 11h5',
  list: 'M9 4H5v17h14V4h-4 M9 2h6v5H9z M8 12h8 M8 16h6',
  chart: 'M3 3v18h18 M8 16v-4 M13 16V7 M18 16V4',
  wallet: 'M20 8V5H6a3 3 0 0 0 0 6h15v8H6a3 3 0 0 1-3-3V8 M21 13h-5v4h5',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2',
  exit: 'M10 4H4v16h6 M10 12h11 M17 8l4 4-4 4',
  calendar: 'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16',
  bag: 'M5 8h14l2 13H3z M9 9V6a3 3 0 0 1 6 0v3',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  chevron: 'M9 6l6 6-6 6',
  check: 'M5 12l5 5L20 7',
  checkCircle: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M7 12l3 3 6-6',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z M15 15l5 5',
  close: 'M6 6l12 12 M18 6L6 18',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  monitor: 'M3 4h18v13H3z M12 17v4 M7 21h10',
  chip: 'M6 6h12v12H6z M10 10h4v4h-4z M9 3v3 M15 3v3 M9 18v3 M15 18v3 M3 9h3 M3 15h3 M18 9h3 M18 15h3',
  code: 'M8 6l-6 6 6 6 M16 6l6 6-6 6 M14 4l-4 16',
  network: 'M9 3h6v5H9z M3 16h6v5H3z M15 16h6v5h-6z M12 8v4 M6 16v-4h12v4',
  message: 'M21 4H3v13h5v4l5-4h8z M7 9h10 M7 13h7',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 6v6l4 2',
  lock: 'M5 10h14v11H5z M8 10V7a4 4 0 0 1 8 0v3 M12 14v3',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  info: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 11v6 M12 7h.01'
};

const routes = {
  dashboard: ['Dashboard', 'home'], catalog: ['Course Catalog', 'book'],
  registrations: ['My Registrations', 'list'], credits: ['Credit Tracker', 'chart'],
  fees: ['Fee Tracker', 'wallet'], profile: ['My Profile', 'user']
};

const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]}"/></svg>`;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const formatDate = value => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'UTC' })
  .format(new Date(`${value}T00:00:00Z`));
const money = value => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(value);
const initials = name => name.trim().split(/\s+/).slice(0, 2).map(part => part[0].toUpperCase()).join('');
const tile = (symbol, color = 'purple') => `<span class="icon-tile ${color}">${icon(symbol)}</span>`;
const pill = (label, color = label.toLowerCase()) => `<span class="pill ${color}">${escapeHtml(label)}</span>`;
const primary = (label, href, symbol = '') => `<a class="button primary" href="#${href}">${symbol ? icon(symbol) : ''}${label}</a>`;
const empty = (title, description, action = '') => `<div class="empty">${tile('book')}<h3>${title}</h3><p>${description}</p>${action}</div>`;

function brand() {
  return `<a href="#home" class="brand" aria-label="Course Registration Tracker home">
    <span class="brand-mark">${icon('cap')}</span><span>Course Registration<span class="brand-sub">Tracker</span></span>
  </a>`;
}

function publicLayout(content) {
  return `<div class="public-shell">
    <header class="public-header">${brand()}</header>
    <main id="main-content" class="public-main" tabindex="-1">
      <div class="public-content">${content}</div>
      <div class="campus" aria-hidden="true"></div>
    </main>
    <footer class="public-footer">
      <span>College micro-project · Demonstration portal</span>
      <span>Credits: Anushka Jain</span>
    </footer>
  </div>`;
}

function landingView() {
  return publicLayout(`<section class="landing-intro">
      <span class="eyebrow"><span></span> STUDENT ACADEMIC PORTAL</span>
      <h1>Course Registration <em>Tracker</em></h1>
      <p>Browse courses, manage your registrations, and keep track of credits and academic fees in one place.</p>
    </section>
    <div class="access-list">
      <a href="#login" class="access-card student-access" aria-label="Student Login">${tile('cap')}
        <span><strong>Student Login</strong><small>Access your student dashboard</small></span>
        <span class="access-arrow">${icon('chevron')}</span>
      </a>
      <a href="#faculty-login" class="access-card faculty-access" aria-label="Faculty Login">${tile('user', 'muted')}
        <span><strong>Faculty Login</strong><small>Review registrations and manage courses</small></span>
        <span class="access-arrow">${icon('chevron')}</span>
      </a>
    </div>`);
}

function field(label, name, options = {}) {
  const { type = 'text', value = '', autocomplete = 'off', placeholder = '', extra = '' } = options;
  return `<label class="field"><span>${label}</span><input required name="${name}" type="${type}" autocomplete="${autocomplete}"
    value="${escapeHtml(value)}" placeholder="${placeholder}" ${extra}></label>`;
}

function studentFields(student = {}) {
  return `${field('Full name', 'name', { value: student.name, autocomplete: 'name', extra: 'maxlength="80"' })}
    ${field('Email address', 'email', { type: 'email', value: student.email, autocomplete: 'email' })}
    ${field('Mobile number', 'mobile', { type: 'tel', value: student.mobile, autocomplete: 'tel',
      extra: 'pattern="[+0-9 .\\-]{7,20}" title="Enter 7–20 phone characters"' })}
    ${field('Programme', 'programme', { value: student.programme, placeholder: 'e.g. B.Tech', extra: 'maxlength="50"' })}
    ${field('Branch', 'branch', { value: student.branch, placeholder: 'e.g. Information Technology', extra: 'maxlength="70"' })}
    <label class="field"><span>Current semester</span><select name="semester" required>
      ${Array.from({length: 8}, (_, i) => `<option value="${i + 1}" ${student.semester === i + 1 ? 'selected' : ''}>Semester ${i + 1}</option>`).join('')}
    </select></label>`;
}

const enrollmentField = () => field('Enrollment number', 'enrollment', {
  autocomplete: 'username', placeholder: 'e.g. CRT2026001', extra: 'maxlength="30"'
});
const passwordField = (label = 'Password', current = false) => field(label, 'password', {
  type: 'password', autocomplete: current ? 'current-password' : 'new-password',
  placeholder: current ? 'Enter your password' : 'At least 8 characters', extra: current ? '' : 'minlength="8"'
});

function authView(route) {
  if (route === 'faculty-login') return facultyLoginView();
  if (route === 'signup') return publicLayout(`<a class="back-link" href="#login">Student Login</a>
    <h1 class="auth-title">Create an account</h1><p class="auth-description">Enter your details to set up a local student account.</p>
    <form data-form="signup" class="form">
      <div class="form-grid">${enrollmentField()}${passwordField()}${studentFields()}</div>
      <p class="form-error" role="alert" hidden></p><button class="button primary">Create student account</button>
    </form>`);
  if (route === 'reset') return publicLayout(`<a class="back-link" href="#login">Student Login</a>
    <h1 class="auth-title">Reset your password</h1><p class="auth-description">Use the enrollment number and email on your local account.</p>
    <form data-form="reset" class="form">
      ${enrollmentField()}${field('Email address', 'email', { type: 'email', autocomplete: 'email' })}
      ${passwordField('New password')}<p class="form-error" role="alert" hidden></p>
      <button class="button primary">Reset password</button>
    </form>`);
  return publicLayout(`<a class="back-link" href="#home">Back to portal</a>
    <h1 class="auth-title">Student Login</h1><p class="auth-description">Sign in with your enrollment number to access your dashboard.</p>
    <form data-form="login" class="form">
      ${enrollmentField()}${passwordField('Password', true)}
      <div class="form-aside"><a href="#reset">Forgot password?</a></div>
      <p class="form-error" role="alert" hidden></p><button class="button primary">Sign in</button>
    </form>
    <p class="auth-switch">New student? <a href="#signup">Create an account</a></p>
    <div class="demo-box">${tile('info')}<span><strong>Demo student account</strong><small>${demoEnrollment} · ${demoPassword}</small></span>
      <button type="button" class="button secondary small" data-action="demo">Use demo account</button></div>`);
}

function portalLayout(route, account, content, faculty = false) {
  const pageRoutes = faculty ? facultyRoutes : routes;
  const current = pageRoutes[route]?.[0] ?? 'Review Selection';
  const nav = Object.entries(pageRoutes).map(([key, [label, symbol]]) => `<a href="#${key}"
    ${route === key ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span></a>`).join('');
  const avatar = escapeHtml(initials(account.name));
  return `<div class="portal">
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">${brand()}<button class="icon-button mobile-close" data-action="menu" aria-label="Close navigation">${icon('close')}</button></div>
      <nav aria-label="${faculty ? 'Faculty' : 'Student'} navigation"><p>WORKSPACE</p>${nav}</nav>
      <div class="sidebar-bottom">
        <div class="sidebar-account"><span class="avatar">${avatar}</span>
          <span><strong>${escapeHtml(account.name)}</strong><small>${escapeHtml(faculty ? account.id : account.enrollment)}</small></span></div>
        <button class="logout" data-action="logout">${icon('exit')} Log out</button>
      </div>
    </aside>
    <button class="menu-shade" data-action="menu" aria-label="Close navigation" tabindex="-1"></button>
    <div class="portal-main">
      <header class="topbar">
        <div class="breadcrumb"><button class="icon-button mobile-menu" aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false" data-action="menu">${icon('menu')}</button>
          <span class="crumb-root">${faculty ? 'Faculty Portal' : 'Student Portal'}</span><span class="crumb-chevron">${icon('chevron')}</span><strong>${current}</strong></div>
        <div class="topbar-actions"><span class="year-label">${icon('calendar')} AY ${escapeHtml(faculty ? academicYear : account.year)}</span>
          ${faculty ? `<span class="avatar" title="${escapeHtml(account.name)}">${avatar}</span>` :
    `<a class="selection-link" href="#selection" aria-label="Review Selection">${icon('bag')}<span>${account.selection.length}</span></a>
          <a class="avatar top-avatar" href="#profile" aria-label="Open profile">${avatar}</a>`}</div>
      </header>
      <main id="main-content" class="workspace" tabindex="-1">${content}</main>
    </div>
  </div>`;
}

function pageHeading(title, description, action = '') {
  return `<header class="page-heading"><div><h1>${title}</h1><p>${description}</p></div>${action}</header>`;
}

function metric(symbol, color, label, value, description) {
  return `<article class="metric">${tile(symbol, color)}<div class="metric-label">${label}</div>
    <strong>${value}</strong><small>${description}</small></article>`;
}

function historyTable(student, entries, compact = false) {
  if (!entries.length) return empty('No registrations yet', 'Your submitted courses will appear here.', primary('Browse courses', 'catalog'));
  const courses = listCourses();
  return `<div class="table-scroll"><table>
    <thead><tr><th scope="col">Course</th><th scope="col">Credits</th><th scope="col">Registered on</th><th scope="col">Status</th>${compact ? '' : '<th scope="col">Completion</th>'}</tr></thead>
    <tbody>${entries.map(item => {
      const course = findCourse(item.code, courses);
      const completion = item.completed ? pill('Completed', 'approved') :
        student.enrollment === demoEnrollment && item.status === 'Approved'
          ? `<button class="text-button" data-action="complete" data-code="${course.code}" aria-label="Mark ${escapeHtml(course.name)} complete">Mark complete</button>`
          : '<span class="muted-text">—</span>';
      return `<tr><td><div class="table-course">${tile(course.icon, course.color)}
        <span><strong>${escapeHtml(course.name)}</strong><small>${course.code}</small></span></div></td>
        <td>${item.credits}</td><td>${formatDate(item.date)}</td><td>${pill(item.status)}</td>${compact ? '' : `<td>${completion}</td>`}</tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

function dashboardView(student) {
  const credits = creditSummary(student);
  const pending = student.registrations.filter(item => item.status === 'Pending').length;
  const status = pending ? 'Pending' : credits.count ? 'Approved' : student.registrations.length ? 'Rejected' : 'Not started';
  const recent = [...student.registrations].sort((left, right) => right.date.localeCompare(left.date)).slice(0, 3);
  return `<section class="dashboard-hero">
      <div class="hero-body"><span class="eyebrow hero-eyebrow">${icon('calendar')} SEMESTER ${student.semester} · ${escapeHtml(student.year)}</span>
        <h1>Welcome back, ${escapeHtml(student.name.split(' ')[0])}!</h1>
        <p>${escapeHtml(student.enrollment)} <span aria-hidden="true">·</span> ${escapeHtml(student.programme)}, ${escapeHtml(student.branch)}</p>
        ${primary('Browse Course Catalog', 'catalog', 'book')}</div>
      <div class="hero-image" aria-hidden="true"></div>
    </section>
    <section class="dashboard-section"><h2>Academic overview</h2><div class="metrics">
      ${metric('book', 'purple', 'Registered courses', credits.count, 'Pending and approved courses')}
      ${metric('cap', 'blue', 'Registered credits', credits.registered, 'Credits across active registrations')}
      ${metric('chart', 'mint', 'Earned credits', credits.earned, 'Credits from completed courses')}
      ${metric('checkCircle', 'pink', 'Registration status', status, pending ? `${pending} awaiting approval` : 'Current registration summary')}
    </div></section>
    <div class="dashboard-lower">
      <section class="panel"><div class="panel-header"><h2>Recent registrations</h2><a href="#registrations">View all</a></div>
        ${historyTable(student, recent, true)}</section>
      <section class="panel quick-panel"><div class="panel-header"><h2>Quick links</h2></div>
        <div class="quick-list">${[['selection','Review Selection','bag','purple'], ['credits','Credit Tracker','chart','blue'], ['fees','Fee Tracker','wallet','mint'], ['profile','My Profile','user','pink']]
          .map(([key, label, symbol, color]) => `<a href="#${key}">${tile(symbol, color)}<strong>${label}</strong>${icon('chevron')}</a>`).join('')}</div>
      </section>
    </div>`;
}

function catalogView(student) {
  return `${pageHeading('Course Catalog', 'Explore available courses and build your registration selection.',
    primary(`Review Selection (${student.selection.length})`, 'selection', 'bag'))}
    <div class="filters panel">
      <label class="field search-field"><span>Search courses</span><span class="search-input">${icon('search')}<input id="course-search" type="search" placeholder="Search by course, code, or instructor"></span></label>
      <label class="field"><span>Semester</span><select id="semester-filter"><option value="">All semesters</option>
        ${[...new Set(listCourses().map(course => course.semester))].sort((a, b) => a - b)
          .map(semester => `<option value="${semester}">Semester ${semester}</option>`).join('')}</select></label>
      <label class="field"><span>Availability</span><select id="availability-filter"><option value="">All courses</option><option value="open">Open for registration</option><option value="closed">Registration closed</option></select></label>
    </div>
    <p class="result-count" id="result-count" aria-live="polite"></p>
    <section class="course-grid" id="course-results" aria-label="Courses"></section>`;
}

function courseCards(courses, student) {
  if (!courses.length) return empty('No matching courses', 'Try another search or adjust your filters.');
  return courses.map(course => {
    const existing = student.registrations.find(item => item.code === course.code);
    const availability = existing ? pill('Registration on file', 'neutral')
      : student.selection.includes(course.code) ? pill('In selection', 'purple')
      : course.available ? pill('Open', 'approved') : pill('Closed', 'neutral');
    return `<article class="panel course-card">
      <div class="course-card-top">${tile(course.icon, course.color)}${availability}</div>
      <span class="course-code">${course.code}</span><h2>${escapeHtml(course.name)}</h2><p>${escapeHtml(course.summary)}</p>
      <div class="course-meta"><span>${icon('cap')} ${course.credits} credits</span><span>${icon('calendar')} Semester ${course.semester}</span></div>
      <div class="course-card-footer"><span>${icon('user')} ${escapeHtml(course.instructor)}</span>
        <button class="button secondary small" data-action="details" data-code="${course.code}">View Details</button></div>
    </article>`;
  }).join('');
}

function courseDetails(course, student) {
  const existing = student.registrations.find(item => item.code === course.code);
  const selected = student.selection.includes(course.code);
  const label = existing ? 'Already registered' : selected ? 'Already selected' :
    course.available ? 'Register for Course' : 'Registration closed';
  return `${tile(course.icon, course.color)}<p class="course-code">${course.code}</p>
    <h2 id="dialog-title">${escapeHtml(course.name)}</h2><p>${escapeHtml(course.description)}</p>
    <dl class="detail-grid">
      <div><dt>Credits</dt><dd>${course.credits}</dd></div><div><dt>Semester</dt><dd>${course.semester}</dd></div>
      <div><dt>Instructor</dt><dd>${escapeHtml(course.instructor)}</dd></div><div><dt>Duration</dt><dd>${escapeHtml(course.duration)}</dd></div>
      <div><dt>Registration availability</dt><dd>${course.available ? 'Open' : 'Closed'}</dd></div>
    </dl><div class="dialog-actions"><button class="button primary" data-action="add" data-code="${course.code}"
      ${existing || selected || !course.available ? 'disabled' : ''}>${label}</button></div>`;
}

function selectionView(student) {
  const courses = listCourses();
  const selected = student.selection.map(code => findCourse(code, courses));
  return `${pageHeading('Review Selection', 'Manage your selected courses before submitting your registration.', primary('Browse courses', 'catalog', 'book'))}
    <section class="panel">${selected.length ? `<div class="panel-header"><h2>Selected courses</h2></div>
      <ul class="selection-list">${selected.map(course => `<li>
        <div class="table-course">${tile(course.icon, course.color)}<span><strong>${escapeHtml(course.name)}</strong><small>${course.code} · ${course.credits} credits</small></span></div>
        <button class="button secondary small" data-action="remove" data-code="${course.code}" aria-label="Remove ${escapeHtml(course.name)}">Remove</button>
      </li>`).join('')}</ul>
      <div class="selection-total"><strong>Total selected credits <span>${sumCredits(student.selection)}</span></strong>
        <button class="button primary" data-action="review">Review registration</button></div>`
    : empty('Your selection is empty', 'Add courses from the catalog to start a registration.', primary('Explore the catalog', 'catalog'))}</section>`;
}

function registrationsView(student) {
  return `${pageHeading('My Registrations', 'View your submitted courses and follow their registration status.', primary('Browse courses', 'catalog', 'book'))}
    <section class="panel"><div class="panel-header"><h2>Registration history</h2></div>
      ${historyTable(student, [...student.registrations].sort((left, right) => right.date.localeCompare(left.date)))}</section>`;
}

function creditsView(student) {
  const { registered, earned, remaining } = creditSummary(student);
  const percent = Math.min(100, Math.round(earned / degreeCredits * 100));
  return `${pageHeading('Credit Tracker', 'Track your course credits and progress toward your programme requirement.')}
    <div class="metrics three">
      ${metric('book', 'purple', 'Registered credits', registered, 'Pending and approved registrations')}
      ${metric('checkCircle', 'mint', 'Earned credits', earned, 'Approved courses marked complete')}
      ${metric('cap', 'blue', 'Credits remaining', remaining, 'Credits still needed for your programme')}
    </div><section class="panel tracker-panel">
      <div class="panel-header"><h2>Programme progress</h2></div>
      <div class="tracker-body"><div class="progress-label"><strong>${earned} of ${degreeCredits} credits earned</strong><span>${percent}%</span></div>
        <progress value="${earned}" max="${degreeCredits}" aria-label="Programme credit progress"></progress>
        <p>Credits count toward your programme when an approved course is marked complete.</p></div>
    </section>`;
}

function feesView(student) {
  const { total, paid, remaining } = feeSummary(student);
  const status = remaining === 0 ? pill('Paid', 'approved') :
    paid ? pill('Partially paid', 'pending') : pill('Unpaid', 'neutral');
  return `${pageHeading('Fee Tracker', 'Review your academic fees and demonstration payment history.')}
    <div class="metrics three">
      ${metric('wallet', 'purple', 'Total academic fees', money(total), `Academic year ${escapeHtml(student.year)}`)}
      ${metric('checkCircle', 'mint', 'Fees submitted', money(paid), 'Total recorded payments')}
      ${metric('clock', 'pink', 'Remaining fees', money(remaining), 'Outstanding balance')}
    </div><section class="panel tracker-panel">
      <div class="panel-header"><h2>Payment history</h2>${status}</div>
      ${student.fees.payments.length ? `<div class="table-scroll"><table>
        <thead><tr><th scope="col">Payment</th><th scope="col">Reference</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>
        <tbody>${student.fees.payments.map(payment => `<tr><td><strong>${payment.description}</strong></td><td>${payment.reference}</td>
          <td>${formatDate(payment.date)}</td><td>${money(payment.amount)}</td></tr>`).join('')}</tbody>
      </table></div>` : empty('No payments recorded', 'Demonstration tuition payments appear here when available.')}
    </section>`;
}

function profileView(student) {
  return `${pageHeading('My Profile', 'View and update your student details.')}
    <section class="panel profile-panel"><div class="profile-heading">
      <span class="avatar large-avatar">${escapeHtml(initials(student.name))}</span>
      <div><h2>${escapeHtml(student.name)}</h2><p>${escapeHtml(student.enrollment)}</p></div>
    </div><form data-form="profile" class="form profile-form">
      <div class="form-grid">
        <label class="field"><span>Enrollment number</span><input value="${escapeHtml(student.enrollment)}" readonly></label>
        <label class="field"><span>Academic year</span><input value="${escapeHtml(student.year)}" readonly></label>
        ${studentFields(student)}
      </div><p class="form-error" role="alert" hidden></p>
      <button class="button primary">Save changes</button>
    </form></section>`;
}

