'use strict';

const storageKey = 'course-tracker.v1';
const findCourse = (code, courses = listCourses()) => courses.find(course => course.code === code);
const normalizeEnrollment = value => value.trim().toUpperCase();

function readStore() {
  const saved = localStorage.getItem(storageKey);
  const state = saved ? JSON.parse(saved) : {
    active: null, facultyActive: false, students: [structuredClone(demoAccount)]
  };
  state.courses ??= structuredClone(courseData);
  for (const student of state.students) {
    for (const record of student.registrations) {
      record.credits ??= findCourse(record.code, courseData)?.credits ?? findCourse(record.code, state.courses)?.credits ?? 0;
    }
  }
  if (!saved) localStorage.setItem(storageKey, JSON.stringify(state));
  return state;
}

function listCourses(state = readStore()) {
  return state.courses;
}

function updateStore(action) {
  const state = readStore();
  const result = action(state);
  localStorage.setItem(storageKey, JSON.stringify(state));
  return result;
}

function activeStudent(state = readStore()) {
  if (state.facultyActive) return undefined;
  return state.students.find(student => student.enrollment === state.active);
}

function activeFaculty(state = readStore()) {
  return state.facultyActive ? demoFaculty : undefined;
}

function updateStudent(action) {
  return updateStore(state => {
    const student = activeStudent(state);
    if (!student) throw new Error('Please sign in to continue.');
    return action(student, state);
  });
}

function signIn(enrollment, password) {
  updateStore(state => {
    const student = state.students.find(account =>
      account.enrollment === normalizeEnrollment(enrollment) && account.password === password);
    if (!student) throw new Error('The enrollment number or password is incorrect.');
    state.active = student.enrollment;
    state.facultyActive = false;
  });
}

function createStudent(fields) {
  updateStore(state => {
    const enrollment = normalizeEnrollment(fields.enrollment);
    if (state.students.some(account => account.enrollment === enrollment)) {
      throw new Error('An account already exists for that enrollment number.');
    }
    state.students.push({
      ...fields, enrollment, semester: Number(fields.semester), year: academicYear,
      registrations: [], selection: [], fees: { total: demoAccount.fees.total, payments: [] }
    });
    state.active = enrollment;
    state.facultyActive = false;
  });
}

function resetPassword(enrollment, email, password) {
  updateStore(state => {
    const student = state.students.find(account => account.enrollment === normalizeEnrollment(enrollment)
      && account.email.toLowerCase() === email.trim().toLowerCase());
    if (!student) throw new Error('No local account matches that enrollment number and email.');
    student.password = password;
  });
}

function addSelection(code) {
  updateStudent((student, state) => {
    if (!findCourse(code, state.courses)?.available) throw new Error('Registration is closed for this course.');
    if (student.registrations.some(item => item.code === code)) {
      throw new Error('You already have a registration record for this course.');
    }
    if (!student.selection.includes(code)) student.selection.push(code);
  });
}

function removeSelection(code) {
  updateStudent(student => {
    student.selection = student.selection.filter(selected => selected !== code);
  });
}

function confirmRegistration(reviewedCourses) {
  updateStudent((student, state) => {
    if (!student.selection.length) throw new Error('Select at least one course first.');
    if (student.selection.join() !== reviewedCourses.map(course => course.code).join()) {
      throw new Error('Your selection changed. Review it again before confirming.');
    }
    const registeredCodes = new Set(student.registrations.map(item => item.code));
    const courses = student.selection.map(code => findCourse(code, state.courses));
    if (courses.some(course => !course?.available || registeredCodes.has(course.code))) {
      throw new Error('At least one selected course is no longer available for registration.');
    }
    if (courses.some((course, index) => course.credits !== reviewedCourses[index].credits)) {
      throw new Error('Course credits changed. Review the updated selection before confirming.');
    }
    const date = new Date();
    const localDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      .map(value => String(value).padStart(2, '0')).join('-');
    student.registrations.unshift(...courses.map(({ code, credits }) => ({
      code, credits, date: localDate, status: 'Pending', completed: false
    })));
    student.selection = [];
  });
}

function sumCredits(codes) {
  const courses = listCourses();
  return codes.reduce((sum, code) => sum + (findCourse(code, courses)?.credits ?? 0), 0);
}

function creditSummary(student) {
  const registered = student.registrations.filter(item => item.status !== 'Rejected');
  const total = records => records.reduce((sum, item) => sum + item.credits, 0);
  const earned = total(registered.filter(item => item.status === 'Approved' && item.completed));
  return {
    count: registered.length, registered: total(registered),
    earned, remaining: Math.max(0, degreeCredits - earned)
  };
}

function feeSummary(student) {
  const { total, payments } = student.fees;
  const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  return { total, paid, remaining: Math.max(0, total - paid) };
}

function signInFaculty(id, password) {
  if (normalizeEnrollment(id) !== demoFaculty.id || password !== demoFaculty.password) {
    throw new Error('The faculty ID or password is incorrect.');
  }
  updateStore(state => {
    state.active = null;
    state.facultyActive = true;
  });
}

function updateAsFaculty(action) {
  return updateStore(state => {
    if (!activeFaculty(state)) throw new Error('Sign in as faculty to continue.');
    return action(state);
  });
}

function updateRegistration(enrollment, code, decision) {
  updateAsFaculty(state => {
    const student = state.students.find(account => account.enrollment === enrollment);
    const record = student?.registrations.find(item => item.code === code);
    if (!record) throw new Error('This registration could not be found.');
    if (decision === 'complete') {
      if (record.status !== 'Approved' || record.completed) {
        throw new Error('Only an incomplete, approved course can be marked complete.');
      }
      record.completed = true;
      return;
    }
    if (record.status !== 'Pending' || !['Approved', 'Rejected'].includes(decision)) {
      throw new Error('Only pending registrations can be approved or rejected.');
    }
    record.status = decision;
  });
}

function saveCourse(fields, editCode, available) {
  updateAsFaculty(state => {
    const code = editCode || normalizeEnrollment(fields.code);
    const existing = findCourse(code, state.courses);
    if (editCode && !existing) throw new Error('This course could not be found.');
    if (!editCode && existing) throw new Error('A course with this code already exists.');
    if (!/^[A-Z0-9-]{2,16}$/.test(code)) throw new Error('Use 2–16 letters, digits, or hyphens for the course code.');
    const credits = Number(fields.credits);
    const semester = Number(fields.semester);
    if (!Number.isInteger(credits) || credits < 0 || credits > 30) {
      throw new Error('Credits must be a whole number from 0 to 30.');
    }
    if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
      throw new Error('Choose a semester from 1 to 8.');
    }
    const details = {
      code, credits, semester, available, name: fields.name, instructor: fields.instructor,
      duration: fields.duration, summary: fields.summary, description: fields.description
    };
    if (existing) Object.assign(existing, details);
    else state.courses.push({ ...details, color: 'purple', icon: 'book' });
  });
}
