// EditCountryForm.tsx
'use client';

import { useState } from 'react';
import { CountryStatus, CountryData } from '@/app/page';
import styles from '@/app/styles/mainPage.module.css';
import SmartTextArea from './SmartTextArea';

interface EditCountryFormProps {
  countryName: string;
  data: CountryData;
  onSave: (data: CountryData) => void;
  onCancel: () => void;
}

export default function EditCountryForm({ countryName, data, onSave, onCancel }: EditCountryFormProps) {
  const [status, setStatus] = useState<CountryStatus>(data.status);
  const [note, setNote] = useState<string>(data.note || '');
  const [date, setDate] = useState<string>(
    data.lastTimeVisited ? new Date(data.lastTimeVisited).toISOString().slice(0, 10) : ''
  );
  const handleSave = () => {
    // Convert the string back to a Date object and then into a timestamp
    const lastTimeVisited = date ? new Date(date).getTime() : 0;
    onSave({ status, note, lastTimeVisited });
  };

  return (
    <div>
      <h1 className={styles.h2}>{countryName}</h1>
      <div>
        <label>Статус:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as CountryStatus)}>
          <option value="planned">Планирую посетить</option>
          <option value="visited">Посетил</option>
        </select>
      </div>
      <div>
        <label>Заметка:</label>
        <SmartTextArea
          value={note}
          onChange={(newNote) => setNote(newNote)}
          placeholder="Введите заметку"
        />
      </div>
      <div>
        <label>Дата посещения:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button className={styles.button} onClick={handleSave}>Сохранить</button>
      <button className={styles.button} onClick={onCancel}>Отмена</button>
    </div>
  );
}
