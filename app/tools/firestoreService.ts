import { doc, getDoc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Типы данных
export type CountryStatus = 'planned' | 'visited';

export interface CountryData {
  status: CountryStatus;
  note?: string;
  value?: number;
}

export interface MarkerData {
  lat: number;
  lng: number;
  text: string;
}

// Получение списка стран пользователя
export async function getVisitedCountries(userId: string): Promise<{ [key: string]: CountryData } | null> {
  console.log('Current userId:', userId);
  if (userId) {
    try {
      const userDocRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.visitedCountries) {
          console.log('Data retrieved: ', data.visitedCountries);
          return data.visitedCountries;
        }
      } else {
        console.log('No data found for user:', userId);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
  return null;
}

// Сохранение списка стран
export async function saveVisitedCountries(
  userId: string,
  countries: { [key: string]: CountryData }
): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  await setDoc(userDocRef, { visitedCountries: countries }, { merge: true });
  console.log('✅ Saved to Firebase:', countries);
}

// Добавление маркера для страны
export async function saveMarkerForCountry(userId: string, countryName: string, marker: MarkerData) {
  const countryDocRef = doc(db, 'users', userId, 'visitedCountries', countryName);
  const markersCollectionRef = collection(countryDocRef, 'markers');
  await addDoc(markersCollectionRef, marker);
  console.log(`✅ Marker added for country: ${countryName}`, marker);
}

// Получение маркеров для страны
export async function getMarkersForCountry(userId: string, countryName: string): Promise<MarkerData[]> {
  const countryDocRef = doc(db, 'users', userId, 'visitedCountries', countryName);
  const markersCollectionRef = collection(countryDocRef, 'markers');
  console.log(`Fetching markers for country: ${countryName} at ${countryDocRef.path}`);
  const snapshot = await getDocs(markersCollectionRef);
  console.log(`Fetched ${snapshot.size} markers.`);

  return snapshot.docs.map((doc) => doc.data() as MarkerData);
}

// Пример добавления маркера для пользователя
export async function addMarker(userId: string, marker: MarkerData): Promise<void> {
  try {
    const markerCollectionRef = collection(db, 'users', userId, 'markers');
    await addDoc(markerCollectionRef, marker);
    console.log('✅ Marker added:', marker);
  } catch (error) {
    console.error('Error adding marker:', error);
  }
}

// Создание страны, если она не существует
async function createCountryIfNotExists(countryName: string) {
  const countryDocRef = doc(db, "visitedCountries", countryName);
  await setDoc(countryDocRef, { createdAt: new Date() }, { merge: true });
}
