import React from 'react';
// import Chart from 'react-apexcharts'
import dynamic from 'next/dynamic'

// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { numberWithCommas } from '../utils/numformatting.js'


// export class CustomChart2 extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			// https://apexcharts.com/docs/options
// 			options: {
// 				chart: {
// 					id: `mychart`,
// 					zoom: {
// 						enabled: false
// 					},
// 					animations: {
// 						enabled: false
// 					}
// 				},
// 				stroke: {
// 					curve: 'straight'
// 				},
// 				xaxis: {
// 					// categories: this.props.categories, //[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
// 					labels: {
// 						style: {
// 							colors: 'white',
// 						}
// 					},
// 					type: 'datetime'
// 				},
// 				yaxis: {
// 					labels: {
// 						style: {
// 							colors: "white",
// 						},
// 						formatter: numberWithCommas
// 					}
// 				},
// 				title: {
// 					text: this.props.title,
// 					align: 'center',
// 					style: {
// 						fontSize: '24px',
// 						color: "white"
// 					}
// 				},
// 				dataLabels: {
// 					enabled: false
// 				},
// 				markers: {
// 					size: 3,
// 				},
// 				legend: {
// 					labels: {
// 						colors: 'white',
// 					}
// 				}
// 			},
// 			series: this.props.series,
// 		}

// 	}

// 	render() {
// 		return <div>
// 			e
// 		</div>
// 		return (
// 			<Chart
// 				options={this.state.options}
// 				series={this.state.series}
// 				type="area"
// 				width={this.props.width || 500}
// 				height={this.props.height || 420}
// 			/>
// 		)
// 	}
// }


import { useEffect } from "react"
import { Chart } from "chart.js";
function CustomChart2() {
	useEffect(() => {
		var ctx = document.getElementById('myChart').getContext('2d');
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				datasets: [{
					data: [86, 114, 106, 106, 107, 111, 133],
					label: "Applied",
					borderColor: "#3e95cd",
					backgroundColor: "#7bb6dd",
					fill: false,
				}, {
					data: [70, 90, 44, 60, 83, 90, 100],
					label: "Accepted",
					borderColor: "#3cba9f",
					backgroundColor: "#71d1bd",
					fill: false,
				}, {
					data: [10, 21, 60, 44, 17, 21, 17],
					label: "Pending",
					borderColor: "#ffa500",
					backgroundColor: "#ffc04d",
					fill: false,
				}, {
					data: [6, 3, 2, 2, 7, 0, 16],
					label: "Rejected",
					borderColor: "#c45850",
					backgroundColor: "#d78f89",
					fill: false,
				}
				]
			},
		});
	}, [])
	return (
		<>
			{/* line chart */}
			<h1 className="w-[110px] mx-auto mt-10 text-xl font-semibold capitalize ">line Chart</h1>
			<div className="w-[1100px] h-screen flex mx-auto my-auto">
				<div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl'>
					<canvas id='myChart'></canvas>
				</div>
			</div>
		</>
	)
}

export default CustomChart2;