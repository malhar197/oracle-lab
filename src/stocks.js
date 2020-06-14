import React from 'react';
import Web3 from 'web3';
import{STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS} from './quotecontract.js';

const web3 = new Web3("http://localhost:7545");

class Stocks extends React.Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.getStockInfo = this.getStockInfo.bind(this);
		this.state = {
			symbol: '',
			price: '',
			volume: ''
		}
	}

handleChange(event) {
	this.setState({ symbol: event.target.value });
}

getStockInfo(event){
	fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.state.symbol}&apikey=KEY`)
 	.then(res => res.json())
 	.then((data) => {
 	this.setState(
 		{ symbol: data["Global Quote"]["01. symbol"],
 		price: data["Global Quote"]["05. price"],
 		volume: data["Global Quote"]["06. volume"]});
 	})
 	.catch(console.log);
}

render() {
	return (
		<div>
		<h1> Stock Market Oracle </h1>
		<p> This is a demo Ethereum Oracle designed to retrieve information about stocks from Alpha Vantage.
			Please follow the instructions given below: 
		</p>
		<br />
		<ol>
			<li> Enter a stock symbol, then press the `Get info from Alpha Vantage` button. </li>
		</ol>
		<br />
		<br /> 
		<div className = 'buttons'>
		<form>
		Enter Stock Symbol: <input type="text" value={this.state.symbol} onChange={this.handleChange} />
		</form>
		<br />
		<button type="button" onClick={this.getStockInfo}> Get info from Alpha Vantage </button>
		<br />
		<h3> Stock info from API </h3>
		<div>
		<ul>
		<li> Symbol: {this.state.symbol} </li>
		<li> Price: {this.state.price} </li>
		<li> Volume: {this.state.volume}</li>
		</ul>
		</div>
		</div>
		</div>
	);
}
}
export default Stocks;
