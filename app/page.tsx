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
  deleteMarker,
  updateMarker,
  MarkerData,
  deleteCountry,
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
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [canAddMarker, setCanAddMarker] = useState<boolean>(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const router = useRouter();
  const isFirstRender = useRef(true);

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

  useEffect(() => {
    if (userId) {
      fetch('/countries.geo.json')
        .then((res) => res.json())
        .then((data) => {
          setGeoJsonData(data);
        })
        .catch((err) => console.error('Ошибка загрузки GeoJSON:', err));
  
      getVisitedCountries(userId)
        .then((data) => {
          if (data) setCountryData(data);
          setDataLoaded(true); // Помечаем, что загрузка стран завершена
        })
        .catch((err) => console.error('Ошибка загрузки стран:', err));
  
      getAllMarkers(userId)
        .then((loadedMarkers) => {
          setMarkers(loadedMarkers);
        })
        .catch((err) => console.error('Ошибка загрузки маркеров:', err));
    }
  }, [userId]);

  useEffect(() => {
    if (userId && dataLoaded && !isFirstRender.current) {
      console.log('Сохраняем страны:', countryData);
      saveVisitedCountries(userId, countryData).catch((err) =>
        console.error('Ошибка сохранения стран:', err)
      );
    } else {
      isFirstRender.current = false;
    }
  }, [countryData, userId, dataLoaded]);
  
  const handleCountryClick = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handleUpdateCountryData = (updatedData: CountryData) => {
    console.log(updatedData);
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

  const handleNewMarker = async (marker: MarkerData) => {
    if (!userId) return;

    try {
      await addMarker(userId, marker);
      setMarkers((prev) => [...prev, marker]);
      setCanAddMarker(false);
    } catch (error) {
      console.error('Ошибка добавления маркера:', error);
    }
  };

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
  };

  const handleDeleteSelectedMarker = async () => {
    if (!userId || !selectedMarker) return;

    try {
      await deleteMarker(userId, selectedMarker);
      setMarkers((prev) =>
        prev.filter((m) => !(m.lat === selectedMarker.lat && m.lng === selectedMarker.lng))
      );
      setSelectedMarker(null);
    } catch (error) {
      console.error('Ошибка удаления маркера:', error);
    }
  };
  const handleDeleteCountry = async () => {
    if (!userId || !selectedCountry) return;
  
    try {
      await deleteCountry(userId, selectedCountry);  // Удаление страны из Firebase
      setCountryData((prev) => {
        const updatedData = { ...prev };
        delete updatedData[selectedCountry];  // Удаление страны из локальных данных
        return updatedData;
      });
      setSelectedCountry(null);  
    } catch (error) {
      console.error('Ошибка удаления страны:', error);
    }
  };
  const handleUpdateMarkerText = async (newText: string) => {
    if (!userId || !selectedMarker) return;

    const updatedMarker = { ...selectedMarker, text: newText };

    try {
      await updateMarker(userId, selectedMarker, updatedMarker);
      setMarkers((prev) =>
        prev.map((m) =>
          m.lat === selectedMarker.lat && m.lng === selectedMarker.lng ? updatedMarker : m
        )
      );
      setSelectedMarker(updatedMarker);
    } catch (error) {
      console.error('Ошибка обновления маркера:', error);
    }
  };

  if (!user) return null;

  return (
    <div id={styles.mainContainer}>
      <header id={styles.toolbar}>
        <h1>World Map Tracker</h1>
        <div className={styles.toolbarButtons}>
          <button className={styles.button} onClick={() => setCanAddMarker((prev) => !prev)}>
            {canAddMarker ? 'Закончить' : 'Добавить метку'}
          </button>
          <button className={styles.button} onClick={handleDeleteSelectedMarker} disabled={!selectedMarker}>
            Удалить выбранную метку
          </button>
          <button className={styles.button} onClick={handleLogout}>Выйти</button>
        </div>
      </header>
      <main className={styles.container}>
        <div className={styles.mapContainer}>
          <MapViewClientWrapper
            geoJsonData={geoJsonData}
            countryData={countryData}
            onCountryClick={handleCountryClick}
            markers={markers}
            onNewMarker={handleNewMarker}
            canAddMarker={canAddMarker}
            onMarkerClick={handleMarkerClick}
            onUpdateMarkerText={handleUpdateMarkerText}
            selectedMarker={selectedMarker}
          />
        </div>
        <div id={styles.leftBar}>
          <aside id={styles.visitedListContainer}>
            {selectedCountry ? (
              <EditCountryForm
                countryName={selectedCountry}
                data={countryData[selectedCountry] || { status: 'planned', note: '', lastTimeVisited: 0 }}
                onSave={handleUpdateCountryData}
                onCancel={handleCancelEditing}
                onDelete={handleDeleteCountry}
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
