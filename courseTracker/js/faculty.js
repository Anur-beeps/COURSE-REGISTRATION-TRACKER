'use strict';

const facultyRoutes = {
  'faculty-requests': ['Registration Requests', 'list'],
  'faculty-students': ['Student Roster', 'user'],
  'faculty-courses': ['Manage Courses', 'book']
};

const addCourseButton = `<button class="button primary" data-action="add-course">${icon('book')} Add course</button>`;

function facultyLoginView() {
  return publicLayout(`<a class="back-link" href="#home">Back to portal</a>
    <h1 class="auth-title">Faculty Login</h1>
    <p class="auth-description">Sign in to review student registrations and manage the course catalog.</p>
    <form data-form="faculty-login" class="form">
      ${field('Faculty ID', 'id', { autocomplete: 'username', placeholder: 'e.g. FAC2026001', extra: 'maxlength="30"' })}
      ${passwordField('Password', true)}
      <p class="form-error" role="alert" hidden></p><button class="button primary">Sign in</button>
    </form>
    <div class="demo-box">${tile('info')}<span><strong>Demo faculty account</strong><small>${demoFaculty.id} · ${demoFaculty.password}</small></span>
      <button type="button" class="button secondary small" data-action="faculty-demo">Use faculty demo account</button></div>`);
}

function facultyFilter(label, key, items, value) {
  return `<label class="field"><span>${label}</span><select data-faculty-filter="${key}">
    ${items.map(([code, text]) => `<option value="${escapeHtml(code)}" ${code === value ? 'selected' : ''}>${escapeHtml(text)}</option>`).join('')}
  </select></label>`;
}

function facultySearch(label, value, placeholder) {
  return `<label class="field search-field"><span>${label}</span><span class="search-input">${icon('search')}
    <input data-faculty-filter="query" type="search" value="${escapeHtml(value)}" placeholder="${placeholder}"></span></label>`;
}

function facultyCourseFilter(courses, value) {
  return facultyFilter('Course', 'course', [['', 'All courses'], ...courses.map(course =>
    [course.code, `${course.code} · ${course.name}`])], value);
}

function facultyPage(route, state, filters) {
  if (route === 'faculty-courses') return manageCoursesView(state.courses);
  const requests = route === 'faculty-requests';
  const statusOptions = requests
    ? [['', 'All statuses'], ['Pending', 'Pending'], ['Approved', 'Approved'], ['Rejected', 'Rejected']]
    : [['', 'All students'], ['registered', 'Any submission'], ['approved', 'Has approval'],
      ['pending', 'Has pending request'], ['rejected', 'Has rejected request'], ['unregistered', 'No submissions']];
  return `${requests
    ? pageHeading('Registration Requests', 'Review student submissions and mark approved courses complete.', addCourseButton)
    : pageHeading('Student Roster', 'Find students by enrollment number, course, or registration status.')}
    <div class="filters panel">
      ${facultySearch(requests ? 'Search requests' : 'Search students', filters.query,
        requests ? 'Student, enrollment number, or course' : 'Student or enrollment number')}
      ${facultyFilter(requests ? 'Registration status' : 'Student status', 'status', statusOptions, filters.status)}
      ${facultyCourseFilter(state.courses, filters.course)}
    </div>
    <p class="result-count" id="faculty-result-count" aria-live="polite"></p>
    <section class="panel" id="faculty-results" aria-label="${requests ? 'Registration requests' : 'Student roster'}"></section>`;
}

function facultyResults(route, state, filters) {
  const query = filters.query.trim().toLowerCase();
  if (route === 'faculty-requests') {
    const rows = state.students.flatMap(student => student.registrations.map(record =>
      ({ student, record, course: findCourse(record.code, state.courses) })));
    const matching = rows.filter(({ student, record, course }) =>
      `${student.name} ${student.enrollment} ${course.name} ${course.code}`.toLowerCase().includes(query)
      && (!filters.course || record.code === filters.course)
      && (!filters.status || record.status === filters.status));
    matching.sort((left, right) => right.record.date.localeCompare(left.record.date));
    return { count: matching.length, unit: 'request', html: registrationRequestsTable(matching) };
  }

  const students = state.students.map(student => {
    const counts = { registered: 0, pending: 0, approved: 0, rejected: 0 };
    for (const record of student.registrations) {
      if (filters.course && record.code !== filters.course) continue;
      counts[record.status.toLowerCase()]++;
      counts.registered++;
    }
    return { student, counts };
  }).filter(({ student, counts }) =>
    `${student.name} ${student.enrollment}`.toLowerCase().includes(query)
    && (!filters.status || (filters.status === 'unregistered' ? counts.registered === 0 : counts[filters.status] > 0)));
  students.sort((left, right) => left.student.name.localeCompare(right.student.name));
  return { count: students.length, unit: 'student', html: studentRosterTable(students) };
}

function registrationRequestsTable(rows) {
  if (!rows.length) return empty('No matching requests', 'New student submissions appear here. Try changing your filters.');
  return `<div class="table-scroll"><table class="faculty-table" role="table">
      <thead role="rowgroup"><tr role="row"><th scope="col">Student</th><th scope="col">Course</th><th scope="col">Credits</th>
      <th scope="col">Registered on</th><th scope="col">Status</th><th scope="col">Review</th></tr></thead>
      <tbody role="rowgroup">${rows.map(({ student, record, course }) => {
        const action = (label, decision, style) => `<button class="button ${style} small" data-action="faculty-decision"
          data-enrollment="${escapeHtml(student.enrollment)}" data-code="${course.code}" data-decision="${decision}">${label}</button>`;
        const review = record.completed ? pill('Completed', 'approved') : record.status === 'Pending'
          ? action('Approve', 'Approved', 'primary') + action('Reject', 'Rejected', 'secondary')
          : record.status === 'Approved' ? action('Mark complete', 'complete', 'secondary') : '<span class="muted-text">—</span>';
        return `<tr role="row"><td role="cell"><div class="table-course">
          <span class="avatar">${escapeHtml(initials(student.name))}</span>
          <span><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.enrollment)}</small></span>
        </div></td><td role="cell" data-label="Course"><strong>${escapeHtml(course.name)}</strong><small class="table-secondary">${course.code}</small></td>
        <td role="cell" data-label="Credits">${record.credits}</td><td role="cell" data-label="Registered on">${formatDate(record.date)}</td>
        <td role="cell" data-label="Status">${pill(record.status)}</td>
        <td role="cell" class="faculty-row-actions"><div class="table-actions">${review}</div></td></tr>`;
      }).join('')}</tbody></table></div>`;
}

function studentRosterTable(rows) {
  if (!rows.length) return empty('No matching students', 'Try changing the course, status, or search term.');
  return `<div class="table-scroll"><table class="faculty-table" role="table">
    <thead role="rowgroup"><tr role="row"><th scope="col">Student</th><th scope="col">Programme</th><th scope="col">Semester</th>
    <th scope="col">Submitted</th><th scope="col">Approved</th><th scope="col">Pending</th><th scope="col">Rejected</th></tr></thead>
    <tbody role="rowgroup">${rows.map(({ student, counts }) => `<tr role="row"><td role="cell"><div class="table-course">
      <span class="avatar">${escapeHtml(initials(student.name))}</span>
      <span><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.enrollment)}</small></span>
      </div></td><td role="cell" data-label="Programme">${escapeHtml(student.programme)}<small class="table-secondary">${escapeHtml(student.branch)}</small></td>
      <td role="cell" data-label="Semester">${student.semester}</td><td role="cell" data-label="Submitted">${counts.registered}</td>
      <td role="cell" data-label="Approved">${counts.approved}</td><td role="cell" data-label="Pending">${counts.pending}</td>
      <td role="cell" data-label="Rejected">${counts.rejected}</td></tr>`).join('')}</tbody></table></div>`;
}

function manageCoursesView(courses) {
  return `${pageHeading('Manage Courses', 'Add courses, edit course details, and control registration availability.',
    addCourseButton)}
    <section class="panel"><div class="panel-header"><h2>Course catalog</h2></div>
      <div class="table-scroll"><table class="faculty-table" role="table">
        <thead role="rowgroup"><tr role="row"><th scope="col">Course</th><th scope="col">Instructor</th><th scope="col">Credits</th>
          <th scope="col">Semester</th><th scope="col">Availability</th><th scope="col">Actions</th></tr></thead>
        <tbody role="rowgroup">${courses.map(course => `<tr role="row"><td role="cell"><div class="table-course">${tile(course.icon, course.color)}
          <span><strong>${escapeHtml(course.name)}</strong><small>${course.code}</small></span></div></td>
          <td role="cell" data-label="Instructor">${escapeHtml(course.instructor)}</td><td role="cell" data-label="Credits">${course.credits}</td>
          <td role="cell" data-label="Semester">${course.semester}</td>
          <td role="cell" data-label="Availability">${course.available ? pill('Open', 'approved') : pill('Closed', 'neutral')}</td>
          <td role="cell" class="faculty-row-actions"><button class="button secondary small" data-action="edit-course" data-code="${course.code}">Edit course</button></td></tr>`).join('')}
        </tbody></table></div>
    </section>`;
}

function courseEditor(course) {
  const input = course ?? {};
  const textArea = (label, key, limit) => `<label class="field"><span>${label}</span>
    <textarea name="${key}" required maxlength="${limit}" rows="2">${escapeHtml(input[key])}</textarea></label>`;
  return `${tile('book')}<h2 id="dialog-title">${course ? 'Edit course' : 'Add course'}</h2>
    <form class="form course-form" data-form="course" data-code="${course?.code ?? ''}">
      <div class="form-grid">
        ${field('Course code', 'code', { value: input.code, extra: course ? 'readonly' : 'minlength="2" maxlength="16"' })}
        ${field('Course name', 'name', { value: input.name, extra: 'maxlength="100"' })}
        ${field('Credits', 'credits', { type: 'number', value: input.credits, extra: 'min="0" max="30" step="1"' })}
        <label class="field"><span>Semester</span><select name="semester" required>
          ${Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}" ${input.semester === i + 1 ? 'selected' : ''}>Semester ${i + 1}</option>`).join('')}
        </select></label>
        ${field('Instructor', 'instructor', { value: input.instructor, extra: 'maxlength="80"' })}
        ${field('Duration', 'duration', { value: input.duration, placeholder: 'e.g. 14 weeks', extra: 'maxlength="40"' })}
      </div>
      ${textArea('Short description', 'summary', 180)}
      ${textArea('Full description', 'description', 1000)}
      <label class="check-field"><input name="available" type="checkbox" ${input.available !== false ? 'checked' : ''}> Open for registration</label>
      <p class="form-error" role="alert" hidden></p>
      <div class="dialog-actions"><button type="button" class="button secondary" data-action="close-dialog">Cancel</button>
        <button class="button primary">Save course</button></div>
    </form>`;
}
