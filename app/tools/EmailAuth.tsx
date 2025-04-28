'use client';

import { useState, useEffect } from 'react';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from './firebase'; // Убедитесь, что путь правильный

const EmailAuth: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Подписываемся на изменения состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Функция регистрации
  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError(null);
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);
      setError(err.message);
    }
  };

  // Функция входа
  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError(null);
    } catch (err: any) {
      console.error("Ошибка входа:", err);
      setError(err.message);
    }
  };

  // Функция выхода
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setError(null);
    } catch (err: any) {
      console.error("Ошибка выхода:", err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Email/Password аутентификация</h2>
      {user ? (
        <div>
          <p>Вы авторизованы как: {user.email}</p>
          <button onClick={logout}>Выйти</button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={register}>Зарегистрировать</button>
            <button onClick={login}>Войти</button>
          </div>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default EmailAuth;
