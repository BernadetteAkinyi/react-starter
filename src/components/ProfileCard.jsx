function Avatar({label="initials"}) {
    return <span className="avatar" aria-hidden="true">{label}</span>
}
export default function ProfileCard({name, role, goal, initials, children}){
    return(
       <section className="profile">

        <h2 className="profile-name"><Avatar label={initials} /> {name}</h2>
        <p className="profile-role">{role}</p>

        <div className="goal">
        <span className="goal-label">My Goal: </span>
        <p>{goal}</p>
        </div>
       
        {children && <footer className="profile__footer">{children}</footer>}
    </section>
    )
}