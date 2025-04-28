import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

export type MarkerData = {
  lat: number;
  lng: number;
  text: string;
};

export async function getVisitedCountries(userId: string) {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().visitedCountries || {};
  } else {
    return {};
  }
}

export async function saveVisitedCountries(userId: string, countryData: any) {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, { visitedCountries: countryData }, { merge: true });
}

export async function addMarker(userId: string, marker: MarkerData) {
  const markerRef = doc(collection(db, 'users', userId, 'markers'));
  await setDoc(markerRef, marker);
}

export async function deleteMarker(userId: string, marker: MarkerData) {
  const markersRef = collection(db, 'users', userId, 'markers');
  const snapshot = await getDocs(markersRef);

  snapshot.forEach(async (docSnap) => {
    const data = docSnap.data();
    if (data.lat === marker.lat && data.lng === marker.lng) {
      await deleteDoc(docSnap.ref);
    }
  });
}

export async function getAllMarkers(userId: string): Promise<MarkerData[]> {
  const markersRef = collection(db, 'users', userId, 'markers');
  const snapshot = await getDocs(markersRef);
  const markers: MarkerData[] = [];

  snapshot.forEach((docSnap) => {
    markers.push(docSnap.data() as MarkerData);
  });

  return markers;
}

export async function updateMarker(userId: string, oldMarker: MarkerData, updatedMarker: MarkerData) {
  const markersRef = collection(db, 'users', userId, 'markers');
  const snapshot = await getDocs(markersRef);

  snapshot.forEach(async (docSnap) => {
    const data = docSnap.data();
    if (data.lat === oldMarker.lat && data.lng === oldMarker.lng) {
      await updateDoc(docSnap.ref, updatedMarker);
    }
  });
}

// Функция для удаления страны из данных пользователя
export async function deleteCountry(userId: string, countryName: string) {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data().visitedCountries;
    if (data && data[countryName]) {
      delete data[countryName];  // Удаляем страну из данных
      await setDoc(docRef, { visitedCountries: data }, { merge: true });
    }
  }
}
