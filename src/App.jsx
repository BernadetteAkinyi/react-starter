import Header from './components/Header.jsx'
import TaskList from './components/TaskList.jsx'
import { seedTasks } from './data/seedTasks.js'
import Greetings from './components/Greetings.jsx'
import Stats from './components/Stats.jsx'

/**
 * Week 1 starter.
 *
 * The UI is intentionally static. In Week 2 you will add state and turn this
 * into a working task manager. Read docs/week-02.md before changing anything.
 */
export default function App() {
  const openCount = seedTasks.filter((task) => !task.completed).length
  const doneCount = seedTasks.length - openCount

  return (
    

    <div className="app">
      <Header />

      <Greetings name="Amara" role="Frontend learner"/>


      

      <main className="main" id="tasks">
        <section className="hero">
          <p className="eyebrow">React · Week 1 starter</p>
          <h1>With Energy and Tenacity, we keep going</h1>
          <p className="lede">
            TaskFlow is a small task manager you will build across ten weeks.
            This starter is the static shell. By the end, it will be a routed,
            tested, deployed app — and you will ship a capstone of your own.
          </p>

        <Stats 
          total={seedTasks.length}
          open={openCount}
          done={doneCount}
          />
       
        </section>

        <section className="panel" aria-labelledby="today-heading">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Your list</p>
              <h2 id="today-heading">Today&apos;s tasks</h2>
            </div>
            <span className="pill">{openCount} open</span>
          </div>
        
                 <TaskList tasks={seedTasks} />
          
          

          <p className="panel-note">
            Week 2 adds the form, toggles, and delete buttons. For now, read the
            code and make it yours.
          </p>
        </section>
      </main>

      <footer className="footer" id="about">
        
        <p>Built while learning React. One project, ten weeks.</p>
        <p className="footer-meta">React From Zero to Projects</p>
      </footer>
    </div>
  )
}
