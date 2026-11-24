'use strict';

const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const notice = document.querySelector('#notice');
const portalViews = {
  dashboard: dashboardView, catalog: catalogView, selection: selectionView,
  registrations: registrationsView, credits: creditsView, fees: feesView, profile: profileView
};
const authRoutes = ['login', 'signup', 'reset', 'faculty-login'];
let currentRoute;
let currentAccount;
let noticeTimer;
let reviewedCourses = [];
let filters = { query: '', semester: '', availability: '' };
let facultyFilters = { query: '', status: '', course: '' };

function getRoute(student, faculty) {
  const hash = location.hash.slice(1);
  if (faculty) return Object.hasOwn(facultyRoutes, hash) ? hash : 'faculty-requests';
  if (student) return Object.hasOwn(portalViews, hash) ? hash : 'dashboard';
  if (authRoutes.includes(hash)) return hash;
  if (Object.hasOwn(facultyRoutes, hash)) return 'faculty-login';
  return Object.hasOwn(portalViews, hash) ? 'login' : 'home';
}

function render({ focus = false } = {}) {
  const state = readStore();
  const student = activeStudent(state);
  const faculty = activeFaculty(state);
  const route = getRoute(student, faculty);
  const accountKey = faculty ? 'faculty' : student ? `student:${student.enrollment}` : '';
  if (currentRoute && (currentRoute !== route || currentAccount !== accountKey)) {
    if (dialog.open) dialog.close();
    if (currentRoute === 'catalog') filters = { query: '', semester: '', availability: '' };
    facultyFilters = { query: '', status: '', course: '' };
  }
  currentRoute = route;
  currentAccount = accountKey;
  const title = routes[route]?.[0] ?? facultyRoutes[route]?.[0] ?? ({
    login: 'Student Login', signup: 'Create an account', reset: 'Reset password', selection: 'Review Selection',
    'faculty-login': 'Faculty Login'
  })[route];
  document.title = title ? `${title} · Course Registration Tracker` : 'Course Registration Tracker';
  app.innerHTML = faculty ? portalLayout(route, faculty, facultyPage(route, state, facultyFilters), true)
    : student ? portalLayout(route, student, portalViews[route](student))
    : route === 'home' ? landingView() : authView(route);
  if (route === 'catalog') {
    document.querySelector('#course-search').value = filters.query;
    document.querySelector('#semester-filter').value = filters.semester;
    document.querySelector('#availability-filter').value = filters.availability;
    renderResults(student);
  }
  if (faculty && route !== 'faculty-courses') renderFacultyResults(state);
  if (focus) {
    window.scrollTo(0, 0);
    document.querySelector('#main-content').focus({ preventScroll: true });
  }
}

function renderResults(student = activeStudent()) {
  const query = filters.query.trim().toLowerCase();
  const courses = listCourses().filter(course =>
    `${course.name} ${course.code} ${course.instructor} ${course.summary}`.toLowerCase().includes(query)
    && (!filters.semester || String(course.semester) === filters.semester)
    && (!filters.availability || course.available === (filters.availability === 'open')));
  document.querySelector('#course-results').innerHTML = courseCards(courses, student);
  document.querySelector('#result-count').textContent = `${courses.length} ${courses.length === 1 ? 'course' : 'courses'} found`;
}

function renderFacultyResults(state = readStore()) {
  if (!activeFaculty(state)) return;
  const { count, unit, html } = facultyResults(currentRoute, state, facultyFilters);
  document.querySelector('#faculty-results').innerHTML = html;
  document.querySelector('#faculty-result-count').textContent = `${count} ${unit}${count === 1 ? '' : 's'} found`;
}

function navigate(route) {
  if (location.hash === `#${route}`) render({ focus: true });
  else location.hash = route;
}

function notify(message, error = false) {
  clearTimeout(noticeTimer);
  notice.classList.toggle('error-notice', error);
  notice.innerHTML = `${icon(error ? 'info' : 'checkCircle')}<span>${escapeHtml(message)}</span>`;
  notice.classList.add('visible');
  noticeTimer = setTimeout(() => {
    notice.classList.remove('visible');
    notice.textContent = '';
  }, 4500);
}

function showDialog(content) {
  dialog.innerHTML = `<button class="icon-button dialog-close" type="button" data-action="close-dialog"
      aria-label="Close dialog">${icon('close')}</button>${content}`;
  dialog.showModal();
}

function reviewRegistration(student) {
  if (!student.selection.length) throw new Error('Select at least one course first.');
  const courses = listCourses();
  reviewedCourses = student.selection.map(code => findCourse(code, courses));
  const total = reviewedCourses.reduce((sum, course) => sum + course.credits, 0);
  showDialog(`${tile('list')}<h2 id="dialog-title">Confirm your registration</h2>
    <p>Review the courses below. After submitting, each course will appear in My Registrations with Pending status.</p>
    <ul class="review-courses">${reviewedCourses.map(course =>
      `<li><strong>${escapeHtml(course.name)}</strong><span>${course.credits} credits</span></li>`).join('')}</ul>
    <div class="progress-label"><strong>Total credits</strong><strong>${total}</strong></div>
    <div class="dialog-actions">
      <button class="button secondary" data-action="close-dialog">Back to selection</button>
      <button class="button primary" data-action="confirm">Confirm registration</button>
    </div>`);
}

function markComplete(code) {
  updateStudent(student => {
    const item = student.registrations.find(record => record.code === code);
    if (student.enrollment !== demoEnrollment || item?.status !== 'Approved' || item.completed) {
      throw new Error('This course cannot be marked complete.');
    }
    item.completed = true;
  });
  render();
  document.querySelector('#main-content').focus({ preventScroll: true });
  notify('Course marked complete. Earned credits updated.');
}

function toggleMenu() {
  const portal = document.querySelector('.portal');
  const open = portal.classList.toggle('menu-open');
  const toggle = document.querySelector('.mobile-menu');
  toggle.setAttribute('aria-expanded', open);
  document.querySelector(open ? '.mobile-close' : '.mobile-menu').focus();
}

const actions = {
  demo() {
    signIn(demoEnrollment, demoPassword);
    navigate('dashboard');
  },
  'faculty-demo'() {
    signInFaculty(demoFaculty.id, demoFaculty.password);
    navigate('faculty-requests');
  },
  logout() {
    updateStore(state => {
      state.active = null;
      state.facultyActive = false;
    });
    navigate('home');
    notify('You have been logged out.');
  },
  menu: toggleMenu,
  details(button) {
    showDialog(courseDetails(findCourse(button.dataset.code), activeStudent()));
  },
  'close-dialog'() {
    dialog.close();
  },
  add(button) {
    const code = button.dataset.code;
    addSelection(code);
    dialog.close();
    render();
    document.querySelector(`[data-action="details"][data-code="${code}"]`)?.focus({ preventScroll: true });
    notify(`${findCourse(code).name} added to your selection.`);
  },
  remove(button) {
    removeSelection(button.dataset.code);
    render();
    document.querySelector('#main-content').focus({ preventScroll: true });
    notify('Course removed from your selection.');
  },
  review() {
    reviewRegistration(activeStudent());
  },
  confirm() {
    confirmRegistration(reviewedCourses);
    dialog.close();
    navigate('registrations');
    notify('Registration submitted successfully.');
  },
  complete(button) {
    markComplete(button.dataset.code);
  },
  'faculty-decision'(button) {
    const { enrollment, code, decision } = button.dataset;
    updateRegistration(enrollment, code, decision);
    renderFacultyResults();
    document.querySelector('#main-content').focus({ preventScroll: true });
    notify(decision === 'complete' ? 'Course marked complete. Earned credits updated.'
      : `Registration ${decision.toLowerCase()}.`);
  },
  'add-course'() {
    if (!activeFaculty()) throw new Error('Sign in as faculty to continue.');
    showDialog(courseEditor());
  },
  'edit-course'(button) {
    if (!activeFaculty()) throw new Error('Sign in as faculty to continue.');
    const course = findCourse(button.dataset.code);
    if (!course) throw new Error('This course could not be found.');
    showDialog(courseEditor(course));
  }
};

document.addEventListener('click', event => {
  if (event.target.closest('.skip-link')) {
    event.preventDefault();
    document.querySelector('#main-content').focus();
    return;
  }
  if (event.target.closest('.menu-open .sidebar a')) toggleMenu();
  const button = event.target.closest('[data-action]');
  if (!button) return;
  try {
    actions[button.dataset.action](button);
  } catch (error) {
    if (dialog.open) dialog.close();
    notify(error.message, true);
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.querySelector('.menu-open')) toggleMenu();
});

document.addEventListener('input', event => {
  const facultyKey = event.target.dataset.facultyFilter;
  if (facultyKey) {
    facultyFilters[facultyKey] = event.target.value;
    renderFacultyResults();
    return;
  }
  const filterKeys = {
    'course-search': 'query', 'semester-filter': 'semester', 'availability-filter': 'availability'
  };
  const key = filterKeys[event.target.id];
  if (!key) return;
  filters[key] = event.target.value;
  renderResults();
});

document.addEventListener('submit', event => {
  const form = event.target;
  const type = form.dataset.form;
  if (!type) return;
  event.preventDefault();
  const errorMessage = form.querySelector('.form-error');
  errorMessage.hidden = true;
  try {
    const values = Object.fromEntries([...new FormData(form)].map(([name, value]) =>
      [name, name === 'password' ? value : value.trim()]));
    if (Object.values(values).some(value => !value)) throw new Error('Complete all required fields.');
    if (type === 'login') {
      signIn(values.enrollment, values.password);
      navigate('dashboard');
    } else if (type === 'faculty-login') {
      signInFaculty(values.id, values.password);
      navigate('faculty-requests');
    } else if (type === 'signup') {
      createStudent(values);
      navigate('dashboard');
      notify('Student account created.');
    } else if (type === 'reset') {
      resetPassword(values.enrollment, values.email, values.password);
      navigate('login');
      notify('Password updated. Sign in with your new password.');
    } else if (type === 'profile') {
      updateStudent(student => Object.assign(student, values, { semester: Number(values.semester) }));
      render();
      document.querySelector('[data-form="profile"] button').focus({ preventScroll: true });
      notify('Profile changes saved.');
    } else if (type === 'course') {
      saveCourse(values, form.dataset.code, form.elements.available.checked);
      dialog.close();
      navigate('faculty-courses');
      notify(form.dataset.code ? 'Course changes saved.' : 'Course added to the catalog.');
    }
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
  }
});

window.addEventListener('hashchange', () => render({ focus: true }));
window.addEventListener('storage', event => {
  if (event.key === storageKey || event.key === null) render();
});
try {
  render();
} catch {
  app.innerHTML = '<main class="startup-error" id="main-content" tabindex="-1"><h1>Course Registration Tracker</h1><p>Student data could not be loaded. Check that local storage is enabled for this page.</p></main>';
}
