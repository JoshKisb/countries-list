import axios from "axios";
import { useEffect, useState } from "react";
import "./styles/App.scss";

const apiUrl = "https://restcountries.com/v2/all?fields=name,region,area";

interface Country {
	name: string;
	region: string;
	area: number;
	independent: boolean;
}

function App() {
	const [loading, setLoading] = useState(false);
	const [countries, setCountries] = useState<Country[]>([]);

	useEffect(() => {
		setLoading(true);
		axios
			.get(apiUrl)
			.then((response) => {
				setCountries(response.data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className="App container mt-4">
			<h2>Countries List</h2>

			<div className="content mt-5">
				{loading && (
					<div className="d-flex justify-content-center">
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				)}

				{countries.map((country) => (
					<div className="card mb-3">
						<div className="card-body">
              <p>Country: {country.name}</p>
              <p>Region: {country.region}</p>
              <p>Area Size: {Number(country.area).toLocaleString()}</p>
            </div>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
