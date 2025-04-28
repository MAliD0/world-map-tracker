// page.tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/tools/firebase';
import MapViewClientWrapper from '@/app/MapViewClientWrapper';
import VisitedCountriesList from '@/app/VisitedCountriesList';
import EditCountryForm from '@/app/EditCountryForm';
import {
  getVisitedCountries,
  saveVisitedCountries,
  addMarker,
  getAllMarkers,
  MarkerData,
} from '@/app/tools/firestoreService';
import styles from '@/app/styles/mainPage.module.css';
import AskCountryAIForm from './AskCountryAIForm';

export type CountryStatus = 'planned' | 'visited';

export interface CountryData {
  status: CountryStatus;
  note?: string;
  lastTimeVisited?: number;
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [countryData, setCountryData] = useState<{ [key: string]: CountryData }>({});
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const router = useRouter();
  const isFirstRender = useRef(true);
  const [markColor, setMarkColor] = useState<string>('#FF0000');
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // Подписка на изменения аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth');
      } else {
        setUser(currentUser);
        setUserId(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Загрузка GeoJSON и данных о посещённых странах
  useEffect(() => {
    if (userId) {
      fetch('/countries.geo.json')
        .then((res) => res.json())
        .then((data) => {
          console.log('GeoJSON data:', data);
          setGeoJsonData(data);
        })
        .catch((err) => console.error('Ошибка загрузки GeoJSON:', err));

      getVisitedCountries(userId)
        .then((data) => {
          console.log('Visited countries data:', data);
          if (data) setCountryData(data);
        })
        .catch((err) => console.error('Ошибка загрузки данных стран:', err));
    }
  }, [userId]);

  useEffect(() => {
    const loadMarkers = async () => {
      if (!userId) return;
  
      try {
        const loadedMarkers = await getAllMarkers(userId);
        console.log('[loadMarkers] Загруженные маркеры:', loadedMarkers);
        setMarkers(loadedMarkers);
      } catch (error) {
        console.error('Ошибка загрузки маркеров:', error);
      }
    };
  
    if (userId) {
      loadMarkers();
    }
  }, [userId]);
  
  // Сохранение обновлённых данных о странах
  useEffect(() => {
    if (userId) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      console.log('Saving countryData: ', countryData);
      saveVisitedCountries(userId, countryData).catch((err) =>
        console.error('Ошибка сохранения данных стран:', err)
      );
    }
  }, [countryData, userId]);


  const handleCountryClick = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handleUpdateCountryData = (updatedData: CountryData) => {
    if (selectedCountry) {
      setCountryData((prev) => ({
        ...prev,
        [selectedCountry]: updatedData,
      }));
      setSelectedCountry(null);
    }
  };

  const handleCancelEditing = () => {
    setSelectedCountry(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
    } catch (error) {
      console.error('Ошибка выхода из аккаунта:', error);
    }
  };

  // Функция для добавления (сохранения) нового маркера

  const handleNewMarker = async (marker: MarkerData) => {
    if (!userId) {
      console.error('Пользователь не определён');
      return;
    }
  
    try {
      await addMarker(userId, marker); // ✅ Теперь сохраняем маркер правильно
      setMarkers((prev) => [...prev, marker]);
    } catch (error) {
      console.error('Ошибка при сохранении маркера:', error);
    }
  };
  
  if (!user) return null;

  return (
    <div id={styles.mainContainer}>
      <header id={styles.toolbar}>
        <h1>World Map Tracker</h1>
        <div className={styles.toolbarButtons}>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>
      <main className={styles.container}>
        <div className={styles.mapContainer}>
          {/* Передаём onNewMarker в MapView через обёртку */}
          <MapViewClientWrapper
            geoJsonData={geoJsonData}
            countryData={countryData}
            onCountryClick={handleCountryClick}
            markColorPlanned={markColor}
            markColorVisited={'#008000'}
            markers={markers}
            onNewMarker={handleNewMarker}
          />
        </div>
        <div id={styles.leftBar}>
          <aside id={styles.visitedListContainer}>
            {selectedCountry ? (
              <EditCountryForm
                countryName={selectedCountry}
                data={
                  countryData[selectedCountry] ||
                  { status: 'planned', note: '', lastTimeVisited: 0 }
                }
                onSave={handleUpdateCountryData}
                onCancel={handleCancelEditing}
              />
            ) : (
              <VisitedCountriesList countries={Object.keys(countryData)} />
            )}
          </aside>
          {selectedCountry ? (
            <AskCountryAIForm countryName={selectedCountry} />
          ) : (
            <div className={styles.div}></div>
          )}
        </div>
      </main>
    </div>
  );
}
