function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function daysAgo(count) {
  const date = new Date()
  date.setDate(date.getDate() - count)
  return toISODate(date)
}

/**
 * Temporary seed data for the starter.
 *
 * Week 9: move this into localStorage with a versioned key and a safe read.
 * Do not import seed data directly into pages after that.
 */
export const seedSubjects = [
  {
    id: 'sub-react',
    name: 'React',
    color: '#d9572f',
    targetMinutesPerWeek: 300,
  },
  {
    id: 'sub-math',
    name: 'Math',
    color: '#3f7d58',
    targetMinutesPerWeek: 240,
  },
  {
    id: 'sub-writing',
    name: 'Writing',
    color: '#a56a12',
    targetMinutesPerWeek: 180,
  },
]

export const seedSessions = [
  {
    id: 'ses-1',
    subjectId: 'sub-react',
    title: 'Hooks practice',
    date: daysAgo(5),
    minutes: 50,
    notes: 'useState and useReducer warm-up',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses-2',
    subjectId: 'sub-math',
    title: 'Past paper — calculus',
    date: daysAgo(4),
    minutes: 45,
    notes: 'Questions 1–6',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses-3',
    subjectId: 'sub-react',
    title: 'Context refactor',
    date: daysAgo(3),
    minutes: 60,
    notes: 'Move tasks into a provider',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses-4',
    subjectId: 'sub-writing',
    title: 'Essay outline',
    date: daysAgo(2),
    minutes: 35,
    notes: 'Thesis and three arguments',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses-5',
    subjectId: 'sub-math',
    title: 'Problem set 4',
    date: daysAgo(1),
    minutes: 55,
    notes: '',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses-6',
    subjectId: 'sub-react',
    title: 'Routing practice',
    date: daysAgo(0),
    minutes: 40,
    notes: 'Nested routes and search params',
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

export function subjectName(subjects, subjectId) {
  return subjects.find((subject) => subject.id === subjectId)?.name ?? 'Unknown'
}
