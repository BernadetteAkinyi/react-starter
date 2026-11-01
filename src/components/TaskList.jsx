import TaskItem from './TaskItem.jsx'

/**
 * Renders a list of tasks.
 *
 * @param {{ tasks: Array<{ id: string, title: string, completed: boolean, priority: string }> }} props
 */
export default function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return (
      <p className="empty-state">
        Nothing here yet. Your first task is to add one.
      </p>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}
