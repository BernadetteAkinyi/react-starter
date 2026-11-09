/**
 * A single task row.
 *
 * Week 1: this is a presentational component. It knows how to *look*, not how
 * to change anything. Week 2 will pass in onToggle and onDelete callbacks.
 */


export default function TaskItem({ task }) {
  return (


    <li className={`task ${task.completed ? 'is-done' : ''}`.trim()}>
      <input
        className="task-check"
        type="checkbox"
        checked={task.completed}
        readOnly
        aria-label={`Mark "${task.title}" as ${task.completed ? 'open' : 'done'}`}
      />

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        <p className="task-meta">
          <span className={`priority priority-${task.priority}`}>
            {task.priority}
          </span>
          <span aria-hidden="true">·</span>
          <span>{task.due}</span>
        </p>
      </div>

      <button
        className="icon-button"
        type="button"
        disabled
        title="You will build this in Week 2"
        aria-label={`Delete "${task.title}"`}
      >
        ×
      </button>
    </li>
  )
}
