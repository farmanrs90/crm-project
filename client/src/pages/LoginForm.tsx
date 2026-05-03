import { useState } from 'react';
import { authApi } from '../services/authApi';
import{useNavigate} from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
      console.log(res);
      
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;