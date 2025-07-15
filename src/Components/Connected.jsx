import React from "react";

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="connected-header">You are Connected to Metamask</h1>
            <p className="connected-account">
                <strong>Metamask Account:</strong> {props.account}
            </p>
            <p className="connected-account">
                <strong>Remaining Time:</strong> {props.remainingTime}
            </p>
            
            { props.showButton ? (
                <div className="vote-status">
                    <p className="connected-account" style={{color: '#28a745', fontWeight: 'bold'}}>
                        ✅ You have already voted
                    </p>
                </div>
            ) : (
                <div className="voting-section">
                    <p className="connected-account">
                        <strong>Cast your vote:</strong>
                    </p>
                    <input 
                        type="number" 
                        placeholder="Enter Candidate Index" 
                        value={props.number} 
                        onChange={props.handleNumberChange}
                        min="0"
                        max={props.candidates.length - 1}
                    />
                    <br />
                    <button className="login-button" onClick={props.voteFunction}>
                        Vote
                    </button>
                </div>
            )}
            
            <div className="candidates-section">
                <h2 style={{color: '#333', marginBottom: '1rem',marginleft:'78px'}}>Candidates</h2>
                <table id="myTable" className="candidates-table">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Candidate Name</th>
                            <th>Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.candidates.map((candidate, index) => (
                            <tr key={index}>
                                <td>{candidate.index}</td>
                                <td>{candidate.name}</td>
                                <td>{candidate.voteCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Connected;