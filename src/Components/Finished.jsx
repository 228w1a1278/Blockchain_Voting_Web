import React, { useState } from "react";

const Finished = (props) => {
    const [durationInput, setDurationInput] = useState(60);

    // Find winning candidate
    const winningCandidate = props.candidates?.length > 0 
        ? props.candidates.reduce((prev, current) => 
            (prev.voteCount > current.voteCount) ? prev : current
          )
        : null;

    return (
        <div className="finished-container">
            <h1 className="welcome-message">Voting is Finished</h1>
            
            {/* Show results */}
            {winningCandidate && (
                <div className="results-section" style={{
                    backgroundColor: '#f8f9fa',
                    padding: '2rem',
                    margin: '2rem 0',
                    borderRadius: '8px',
                    border: '2px solid #28a745'
                }}>
                    <h2 style={{color: '#28a745', marginBottom: '1rem'}}>🏆 Winner</h2>
                    <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#333'}}>
                        {winningCandidate.name}
                    </p>
                    <p style={{color: '#666'}}>
                        Total Votes: {winningCandidate.voteCount}
                    </p>
                </div>
            )}

            {/* Show all results */}
            {props.candidates?.length > 0 && (
                <div className="candidates-section" style={{margin: '2rem 0'}}>
                    <h2 style={{color: '#333', marginBottom: '1rem',marginLeft:'120px'}}>Final Results</h2>
                    <table className="candidates-table" style={{
                        marginLeft:"45px",
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <thead>
                            <tr style={{backgroundColor: '#f8f9fa'}}>
                                <th style={{padding: '1rem', border: '1px solid #dee2e6'}}>Rank</th>
                                <th style={{padding: '1rem', border: '1px solid #dee2e6'}}>Candidate Name</th>
                                <th style={{padding: '1rem', border: '1px solid #dee2e6'}}>Vote Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.candidates
                                .sort((a, b) => b.voteCount - a.voteCount)
                                .map((candidate, index) => (
                                <tr key={candidate.index} style={{
                                    backgroundColor: index === 0 ? '#d4edda' : 'white'
                                }}>
                                    <td style={{
                                        padding: '1rem', 
                                        border: '1px solid #dee2e6',
                                        textAlign: 'center',
                                        fontWeight: index === 0 ? 'bold' : 'normal'
                                    }}>
                                        {index + 1}{index === 0 ? ' 🏆' : ''}
                                    </td>
                                    <td style={{
                                        padding: '1rem', 
                                        border: '1px solid #dee2e6',
                                        fontWeight: index === 0 ? 'bold' : 'normal'
                                    }}>
                                        {candidate.name}
                                    </td>
                                    <td style={{
                                        padding: '1rem', 
                                        border: '1px solid #dee2e6',
                                        textAlign: 'center',
                                        fontWeight: index === 0 ? 'bold' : 'normal'
                                    }}>
                                        {candidate.voteCount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Admin Controls for Restart */}
            {props.isOwner && (
                <div className="admin-controls" style={{
                    backgroundColor: '#fff3cd', 
                    padding: '2rem', 
                    margin: '2rem 0', 
                    borderRadius: '8px',
                    border: '2px solid #ffc107'
                }}>
                    <h3 style={{color: '#856404', marginBottom: '1rem'}}>🔧 Admin Controls</h3>
                    <p style={{color: '#856404', marginBottom: '1rem'}}>
                        As the contract owner, you can restart the voting process.
                    </p>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                        <label style={{color: '#856404', fontWeight: 'bold'}}>
                            New Voting Duration (minutes): 
                        </label>
                        <input 
                            type="number" 
                            value={durationInput}
                            onChange={(e) => setDurationInput(e.target.value)}
                            min="1"
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #ffc107',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    
                    <button 
                        className="login-button" 
                        onClick={() => props.restartVoting(durationInput)}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '1rem 2rem',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        🔄 Restart Voting
                    </button>
                </div>
            )}
        </div>
    )
}

export default Finished;