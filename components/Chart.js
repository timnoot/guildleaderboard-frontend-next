import React from 'react';
// import Chart from 'react-apexcharts'
import dynamic from 'next/dynamic'
    
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { numberWithCommas } from '../utils/numformatting.js'


export class CustomChart2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// https://apexcharts.com/docs/options
			options: {
				chart: {
					id: `mychart`,
					zoom: {
						enabled: false
					},
					animations: {
						enabled: false
					}
				},
				stroke: {
					curve: 'straight'
				},
				xaxis: {
					// categories: this.props.categories, //[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
					labels: {
						style: {
							colors: 'white',
						}
					},
					type: 'datetime'
				},
				yaxis: {
					labels: {
						style: {
							colors: "white",
						},
						formatter: numberWithCommas
					}
				},
				title: {
					text: this.props.title,
					align: 'center',
					style: {
						fontSize: '24px',
						color: "white"
					}
				},
				dataLabels: {
					enabled: false
				},
				markers: {
					size: 3,
				},
				legend: {
					labels: {
						colors: 'white',
					}
				}
			},
			series: this.props.series,
		}

	}

	render() {
		return (
			<Chart
				options={this.state.options}
				series={this.state.series}
				type="area"
				width={this.props.width || 500}
				height={this.props.height || 420}
			/>
		)
	}
}