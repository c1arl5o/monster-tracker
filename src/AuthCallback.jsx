import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const params = new URLSearchParams(window.location.search);
      const token_hash = params.get('token_hash');
      const type = params.get('type');

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });

        if (error) {
          setError(error.message);
        } else {
          // Successfully verified, redirect to home
          navigate('/');
        }
      } else {
        setError('Invalid confirmation link');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  if (error) {
    return (
      <div className="auth-container">
        <h2>Confirmation Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Confirming your email...</h2>
    </div>
  );
}

export default AuthCallback;