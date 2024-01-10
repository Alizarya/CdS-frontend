import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../../utils/userConnexion'; 

function ResetThePassword() {
    const { resetToken } = useParams();
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();

        try {
            // Votre fonction pour réinitialiser le mot de passe en utilisant resetToken, newEmail et newPassword
            const response = await resetPassword(resetToken, newEmail, newPassword);
            console.log('Réinitialisation réussie:', response);
            setResetSuccess(true);
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            setError('Erreur lors de la réinitialisation du mot de passe');
        }
    };

    return (
        <div>
            {!resetSuccess ? (
                <form onSubmit={handleReset}>
                    <h2>Réinitialisation du mot de passe</h2>
                    <div className="form-group">
                        <label htmlFor="newEmail">Confirmation de votre email</label>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Nouveau mot de passe</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Réinitialiser</button>
                    {error && <p>{error}</p>}
                </form>
            ) : (
                <p>Réinitialisation réussie !</p>
            )}
        </div>
    );
}

export default ResetThePassword;
