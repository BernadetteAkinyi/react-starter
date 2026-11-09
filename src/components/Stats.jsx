export default function Stats({total, open, done}) {
    return (
        <div className="stats" aria-label="Task Summary">
            <div className="stat">
                <strong>{total}</strong>
                <span>total</span>
            </div>

            <div className="stat">
                <strong>{open}</strong>
                <span>open</span>
            </div>

            <div className="stat">
                <strong>{done}</strong>
                <span>done</span>
            </div>
            
        </div>
    )
}