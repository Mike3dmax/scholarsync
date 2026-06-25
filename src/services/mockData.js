import { addDays, addHours, setHours, setMinutes } from 'date-fns';

const now = new Date();

export const mockUser = {
  id: 'u1',
  name: 'Emma Chen',
  email: 'emma@scholarsync.app',
  avatar: null,
  academicLevel: 'undergrad',
  major: 'Computer Science',
  studyPreferences: ['morning', 'evening'],
  theme: 'light',
  streak: 7,
};

export const mockSubjects = [
  { id: 's1', name: 'Calculus II', color: 'blue', semester: 'Fall 2026' },
  { id: 's2', name: 'Data Structures', color: 'emerald', semester: 'Fall 2026' },
  { id: 's3', name: 'English Literature', color: 'purple', semester: 'Fall 2026' },
  { id: 's4', name: 'Physics 101', color: 'amber', semester: 'Fall 2026' },
  { id: 's5', name: 'Art History', color: 'pink', semester: 'Fall 2026' },
];

export const mockTasks = [
  { id: 't1', title: 'Binary Search Tree Implementation', description: 'Implement BST with insert, delete, and traversal methods in Java.', subjectId: 's2', priority: 'high', dueDate: addDays(now, 2).toISOString(), status: 'in_progress', subtasks: [{ id: 'st1', title: 'Write insert method', done: true }, { id: 'st2', title: 'Write delete method', done: false }, { id: 'st3', title: 'Write traversal methods', done: false }], createdAt: addDays(now, -3).toISOString() },
  { id: 't2', title: 'Calculus Problem Set 7', description: 'Complete problems 1-20 from Chapter 7.', subjectId: 's1', priority: 'high', dueDate: addDays(now, 1).toISOString(), status: 'todo', subtasks: [], createdAt: addDays(now, -2).toISOString() },
  { id: 't3', title: 'Physics Lab Report', description: 'Write up the results from the pendulum experiment.', subjectId: 's4', priority: 'medium', dueDate: addDays(now, 5).toISOString(), status: 'review', subtasks: [{ id: 'st4', title: 'Data analysis', done: true }, { id: 'st5', title: 'Write introduction', done: true }, { id: 'st6', title: 'Conclusion', done: false }], createdAt: addDays(now, -5).toISOString() },
  { id: 't4', title: 'Read Chapter 4 - Romantic Poetry', description: 'Read and annotate chapters on Wordsworth and Keats.', subjectId: 's3', priority: 'medium', dueDate: addDays(now, 3).toISOString(), status: 'todo', subtasks: [], createdAt: addDays(now, -1).toISOString() },
  { id: 't5', title: 'Art History Essay Outline', description: 'Draft outline for the Baroque period essay.', subjectId: 's5', priority: 'low', dueDate: addDays(now, 7).toISOString(), status: 'done', subtasks: [{ id: 'st7', title: 'Research sources', done: true }, { id: 'st8', title: 'Write thesis', done: true }], createdAt: addDays(now, -7).toISOString() },
  { id: 't6', title: 'Study for Midterm - Data Structures', description: 'Review all topics covered in weeks 1-8.', subjectId: 's2', priority: 'high', dueDate: addDays(now, 4).toISOString(), status: 'todo', subtasks: [], createdAt: addDays(now, -3).toISOString() },
  { id: 't7', title: 'Calculus Group Project', description: 'Meet with group to work on optimization problem presentation.', subjectId: 's1', priority: 'medium', dueDate: addDays(now, 6).toISOString(), status: 'todo', subtasks: [{ id: 'st9', title: 'Divide sections', done: true }, { id: 'st10', title: 'Solve problems', done: false }], createdAt: addDays(now, -4).toISOString() },
];

export const mockEvents = [
  { id: 'e1', title: 'Calculus II Lecture', subjectId: 's1', start: setHours(setMinutes(now, 0), 9).toISOString(), end: setHours(setMinutes(now, 50), 10).toISOString(), recurring: true, type: 'class' },
  { id: 'e2', title: 'Data Structures Lab', subjectId: 's2', start: setHours(setMinutes(addDays(now, 1), 0), 14).toISOString(), end: setHours(setMinutes(addDays(now, 1), 50), 15).toISOString(), recurring: true, type: 'class' },
  { id: 'e3', title: 'Study Group - Physics', subjectId: 's4', start: setHours(setMinutes(addDays(now, 2), 0), 11).toISOString(), end: setHours(setMinutes(addDays(now, 2), 0), 12).toISOString(), recurring: false, type: 'study' },
  { id: 'e4', title: 'English Literature Seminar', subjectId: 's3', start: setHours(setMinutes(addDays(now, 3), 0), 10).toISOString(), end: setHours(setMinutes(addDays(now, 3), 0), 11).toISOString(), recurring: true, type: 'class' },
  { id: 'e5', title: 'Office Hours - Calculus', subjectId: 's1', start: setHours(setMinutes(addDays(now, 1), 0), 16).toISOString(), end: setHours(setMinutes(addDays(now, 1), 0), 17).toISOString(), recurring: false, type: 'office_hours' },
];

export const mockTimerSessions = [
  { id: 'ts1', date: addDays(now, -1).toISOString(), duration: 1500, subjectId: 's2', taskId: 't1' },
  { id: 'ts2', date: addDays(now, -2).toISOString(), duration: 1200, subjectId: 's1' },
  { id: 'ts3', date: addDays(now, -3).toISOString(), duration: 1800, subjectId: 's4', taskId: 't3' },
  { id: 'ts4', date: addDays(now, -4).toISOString(), duration: 900, subjectId: 's3' },
  { id: 'ts5', date: addDays(now, -5).toISOString(), duration: 2400, subjectId: 's2' },
];
