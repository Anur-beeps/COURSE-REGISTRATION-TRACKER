'use strict';

const courseData = [
  {
    code: 'IT101', name: 'Introduction to Information Technology', credits: 3, semester: 1,
    instructor: 'Dr. Meera Sharma', duration: '14 weeks', available: true, color: 'purple', icon: 'monitor',
    summary: 'Explore computer systems, networks, databases, and the fundamentals of information technology.',
    description: 'Build a practical foundation in computer hardware, operating systems, networking, databases, and information security. Apply those concepts in weekly labs and a short technology evaluation project.'
  },
  {
    code: 'IT102', name: 'Digital Logic Design', credits: 4, semester: 2,
    instructor: 'Prof. Rohan Desai', duration: '16 weeks', available: true, color: 'blue', icon: 'chip',
    summary: 'Design and analyze digital circuits using logic gates, Boolean algebra, and sequential systems.',
    description: 'Use Boolean algebra, Karnaugh maps, and simulation tools to design combinational and sequential circuits. Lab work covers counters, registers, and simple state machines.'
  },
  {
    code: 'IT103', name: 'Programming in C', credits: 4, semester: 1,
    instructor: 'Prof. Neha Kulkarni', duration: '16 weeks', available: true, color: 'mint', icon: 'code',
    summary: 'Develop problem-solving skills through structured programming, pointers, and file handling in C.',
    description: 'Practice translating problems into C programs using control flow, functions, arrays, pointers, structures, and file handling. The final lab project combines these topics in a command-line application.'
  },
  {
    code: 'MA201', name: 'Discrete Structures', credits: 3, semester: 2,
    instructor: 'Dr. Kavita Rao', duration: '14 weeks', available: true, color: 'pink', icon: 'network',
    summary: 'Study sets, relations, logic, counting, and graphs as foundations for computer science.',
    description: 'Learn mathematical reasoning, proof techniques, relations, counting, recurrence, and graph theory. Exercises connect discrete structures with practical problems in computing.'
  },
  {
    code: 'MA202', name: 'Statistical Techniques', credits: 3, semester: 2,
    instructor: 'Dr. Arjun Mehta', duration: '14 weeks', available: true, color: 'gold', icon: 'chart',
    summary: 'Analyze data with probability, sampling, estimation, and introductory hypothesis testing.',
    description: 'Summarize data, work with probability distributions, and interpret confidence intervals and basic hypothesis tests. Class activities use small datasets to practice choosing and explaining statistical methods.'
  },
  {
    code: 'HS101', name: 'Communication Skills', credits: 2, semester: 1,
    instructor: 'Prof. Aditi Joshi', duration: '12 weeks', available: false, color: 'lilac', icon: 'message',
    summary: 'Build confidence in academic writing, presentations, and professional communication.',
    description: 'Practice writing clear reports, presenting technical topics, and participating in group discussions. Workshops include peer feedback and interview practice.'
  }
];

const academicYear = '2026–27';
const degreeCredits = 120;
const demoEnrollment = 'CRT2026001';
const demoPassword = 'Student@123';
const demoFaculty = {
  id: 'FAC2026001', password: 'Faculty@123', name: 'Dr. Meera Sharma'
};
const demoAccount = {
  enrollment: demoEnrollment, password: demoPassword, name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com', mobile: '9876543210', programme: 'B.Tech',
  branch: 'Information Technology', year: academicYear, semester: 2,
  selection: [],
  registrations: [
    { code: 'IT101', date: '2026-07-15', status: 'Approved', completed: true },
    { code: 'IT103', date: '2026-11-12', status: 'Approved', completed: false },
    { code: 'IT102', date: '2026-11-15', status: 'Pending', completed: false },
    { code: 'HS101', date: '2026-07-18', status: 'Rejected', completed: false }
  ],
  fees: {
    total: 65000,
    payments: [
      { reference: 'DEMO-26001', date: '2026-07-14', description: 'Tuition installment 1', amount: 25000 },
      { reference: 'DEMO-26002', date: '2026-09-10', description: 'Tuition installment 2', amount: 15000 }
    ]
  }
};
