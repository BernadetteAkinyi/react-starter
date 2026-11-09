
function Badge({label = 'New'}) {
    return <span className = "pill">{label}</span>
}

function Panel({ title, children }) {
    return (
        <section className= "panel">
            <h2>{title}</h2>
            {children}
        </section>
    )
}

export default function Greeting({name, role}) {
     const displayName = name.toUpperCase()
    return (
        <div className="greeting">
            <h2>Welcome, {displayName} <Badge label="Admin" /></h2>
            <p>{role}</p>
        
        
           
        </div>

        
    )


}
