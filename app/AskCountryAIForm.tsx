'use client';

import { useState } from 'react';
import styles from '@/app/Styles/mainPage.module.css';

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
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,          
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // ИЛИ твой деплой сайт
          'X-Title': 'world-map-tracker',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct', // бесплатная модель
          messages: [
            { role: 'system', content: 'You are a tourist guide. Give short answers in english, responce under 6 sentences and 100 words' },
            { role: 'user', content: `Tell about a country ${countryName}. Question: ${question}` },
          ],
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Ошибка от сервера:', errorText);
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
            <h2 className="text-lg font-semibold mb-2">❓ Спросить о {countryName}</h2>
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
                <p>{answer}</p>
                </div>
            )}
        </div>
    </div>
  );
}
