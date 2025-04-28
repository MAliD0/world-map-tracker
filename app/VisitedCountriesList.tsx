import styles from "@/app/Styles/mainPage.module.css"

interface VisitedCountriesListProps {
    countries: string[];
  }
  
  export default function VisitedCountriesList({ countries }: VisitedCountriesListProps) {
    return (
      <div>
        <h2 className={styles.h2}>🌍 Посещённые страны:</h2>
        {countries.length === 0 ? (
          <p >Нажмите на страну на карте, чтобы добавить</p>
        ) : (
          <ul >
            {countries.map((country, index) => (
              <li key={index}>{country}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  