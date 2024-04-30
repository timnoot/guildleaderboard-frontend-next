import { useEffect } from "react"
// import { Chart } from "chart.js";
import Chart from 'chart.js/auto';

// gray ish
Chart.defaults.color = '#d1d5db';

export const CustomChart2 = ({ title, datasets, labels, options }) => {
	useEffect(() => {
		var ctx = document.getElementById(title).getContext('2d');
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: datasets
			},
			options: options
		});
	}, [])

	// [{
	// 	data: [86, 114, 106, 106, 107, 111, 133],
	// 	label: "Applied",
	// 	borderColor: "rgb(62,149,205)",
	// 	backgroundColor: "rgb(62,149,205,0.1)",
	// }, {
	// 	data: [70, 90, 44, 60, 83, 90, 100],
	// 	label: "Accepted",
	// 	borderColor: "rgb(60,186,159)",
	// 	backgroundColor: "rgb(60,186,159,0.1)",
	// }, {
	// 	data: [10, 21, 60, 44, 17, 21, 17],
	// 	label: "Pending",
	// 	borderColor: "rgb(255,165,0)",
	// 	backgroundColor: "rgb(255,165,0,0.1)",
	// }, {
	// 	data: [6, 3, 2, 2, 7, 0, 16],
	// 	label: "Rejected",
	// 	borderColor: "rgb(196,88,80)",
	// 	backgroundColor: "rgb(196,88,80,0.1)",
	// }
	// ]

	const exportToCSV = () => {
		// Convert datasets and labels to CSV format
		let csvContent = "data:text/csv;charset=utf-8,";

		// header top left cell = title of the chart, then guild names
		csvContent += `${title},`;
		csvContent += datasets.map(dataset => dataset.label).join(',');
		csvContent += '\n';

		for (let i = 0; i < labels.length; i++) {
			const date = new Date(labels[i]);
			csvContent += `${date.toISOString().split('T')[0]},`;
			csvContent += datasets.map(dataset => dataset.data[i]).join(',');
			csvContent += '\n';
		}

		// Create a temporary link element
		const link = document.createElement("a");
		link.href = encodeURI(csvContent);
		link.download = `${title}.csv`;
		link.click();
	};


	return (
		<div className="text-center text-white">
			<div className="relative">
				<h2 className='text-4xl '>{title}</h2>
				<button className='hidden lg:block absolute right-2 top-2 bg-lightprimary rounded-lg py-1 px-2 text-center hover:bg-lighttertiary transition' onClick={exportToCSV}>
					<svg className='inline-block' viewBox="0 0 29.978 29.978" width='1rem' height='1rem' fill='white' xmlns='http://www.w3.org/2000/svg' >
						<path d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012v-8.861H25.462z" />
						<path d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193C15.092,18.979,14.62,18.426,14.62,18.426z" />
					</svg>
					<div className="inline-block m-1">
						Export
					</div>
				</button>
			</div>
			<canvas id={title}></canvas>
		</div >
	)
}

