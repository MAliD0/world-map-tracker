'use client';

import { useState } from 'react';
import styles from '@/app/styles/mainPage.module.css';

interface AskCountryAIFormProps {
  countryName: string;
}

export default function AskCountryAIForm({ countryName }: AskCountryAIFormProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer('');
  
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryName, question }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Ошибка:', errorText);
        throw new Error(`Ошибка запроса: ${res.status}`);
      }
  
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Нет ответа от AI.';
      setAnswer(reply);
    } catch (error) {
      console.error(error);
      setAnswer('Произошла ошибка при обращении к AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.div}>
      <div>
        <h2 className="text-lg font-semibold mb-2"> Спросить о {countryName}</h2>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Например: Что стоит посетить?"
          className="border p-2 rounded w-full mb-2"
        />
        <button 
          onClick={handleAsk}
          disabled={loading || !question}
          className={styles.button}
        >
          {loading ? 'Запрашиваем...' : 'Спросить у AI'}
        </button>
      </div>

      <div className={styles.div}>
        {answer && (
          <div className={styles.div}>
            <h3 className="font-semibold">Ответ AI:</h3>
            <div className="overflow-auto max-h-60 p-2 border rounded">
              <p>{answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
