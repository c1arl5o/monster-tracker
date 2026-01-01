import { supabase } from '../supabaseClient';
import './Home.css';

function Home() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Monster Tracker</h1>
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

export default Home;
