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

const enum SortDirection {
	Unsorted,
	Asc,
	Desc,
}

function App() {
	const [loading, setLoading] = useState(false);
	const [countries, setCountries] = useState<Country[]>([]);
	const [unsortedCountries, setUnsortedCountries] = useState<Country[]>([]);
	const [sorted, setSorted] = useState(SortDirection.Unsorted);

	useEffect(() => {
		setLoading(true);
		axios
			.get(apiUrl)
			.then((response) => {
				setUnsortedCountries(response.data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const toggleSort = () => {
		setSorted((state) => {
			if (state === SortDirection.Unsorted) return SortDirection.Asc;
			else if (state === SortDirection.Asc) return SortDirection.Desc;
			else return SortDirection.Unsorted;
		});
	};

	useEffect(() => {
		if (unsortedCountries.length === 0) return;

		if (sorted === SortDirection.Unsorted) setCountries(unsortedCountries);
		else {
			setCountries(
				unsortedCountries.concat().sort((a, b) => {
					let first = a.name.toLowerCase();
					let second = b.name.toLowerCase();
					if (sorted === SortDirection.Desc)
						[first, second] = [second, first]; // swap the variables
					return first.localeCompare(second);
				})
			);
		}
	}, [sorted, unsortedCountries]);

	const sortingArrow = () => {
		if (sorted === SortDirection.Asc)
			return <div className="ms-2 arrow-up"></div>;
		else if (sorted === SortDirection.Desc)
			return <div className="ms-2 arrow-down"></div>;
		else return <></>;
	};

	return (
		<div className="App container mt-4">
			<h2>Countries List</h2>

			<div className="btn-toolbar mt-3" role="toolbar">
				<div className="btn-group me-2 mt-3" role="group">
					<button
						type="button"
						className={`btn btn-outline-secondary d-flex align-items-center me-2 ${
							sorted !== SortDirection.Unsorted ? "active" : ""
						}`}
						onClick={toggleSort}
					>
						Sort {sortingArrow()}
					</button>
					<button
						type="button"
						className="btn btn-outline-secondary me-2"
					>
						In Oceania region
					</button>
					<button
						type="button"
						className="btn btn-outline-secondary me-2 active"
					>
						Smaller than Lithuania
					</button>
				</div>
			</div>

			<div className="content mt-3">
				{loading && (
					<div className="d-flex justify-content-center mt-5">
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				)}

				{countries.map((country) => (
					<div className="card mb-3" key={country.name}>
						<div className="card-body">
							<p>Country: {country.name}</p>
							<p>Region: {country.region}</p>
							<p>
								Area Size:{" "}
								{Number(country.area).toLocaleString()}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
