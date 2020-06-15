import React from 'react';
import Web3 from 'web3';
import{STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS} from './quotecontract.js';

const web3 = new Web3("http://localhost:7545");

class Stocks extends React.Component {


	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.getStockInfo = this.getStockInfo.bind(this);
		this.setStockInfo = this.setStockInfo.bind(this);
		this.getStockPrice = this.getStockPrice.bind(this);
		this.getStockVolume = this.getStockVolume.bind(this);
		this.state = {
			tempSymbol: '',
			symbol: '',
			price: '',
			volume: '',
			priceFromContract: '',
			volumeFromContract: ''
		}
	}

handleChange = event => {
	this.setState({ tempSymbol: event.target.value });
}

setSymbol = event => {
	event.preventDefault();
	let symbl = this.state.tempSymbol;
	this.setState( {symbol: symbl});

}

getStockInfo = event => {
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

setStockInfo = async (event) => {
	event.preventDefault();
	try {

            const accounts = await web3.eth.getAccounts();
			const stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS);
            console.log("Account 0 = ", accounts[0]);
            const retval = await stockQuote.methods.setStock(web3.utils.fromAscii(this.state.symbol), parseInt(this.state.price * 100), parseInt(this.state.volume)).send({ from: accounts[0] });

        }
        catch (error) {
            console.log('setStock failed', error);
        }
}

getStockPrice = async (event) => {
	const accounts = await web3.eth.getAccounts();
	const stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS);
    console.log("Account 0 = ", accounts[0]);
    let retrievedPrice = await stockQuote.methods.getStockPrice(web3.utils.fromAscii(this.state.symbol)).call();
        this.setState({ priceFromContract: parseFloat(retrievedPrice / 100) });
}

getStockVolume = async (event) => {
	const accounts = await web3.eth.getAccounts();
	const stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS);
    console.log("Account 0 = ", accounts[0]);
    let retrievedVolume = await stockQuote.methods.getStockVolume(web3.utils.fromAscii(this.state.symbol)).call();
        this.setState({ volumeFromContract: retrievedVolume });
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
		<form onSubmit={this.setSymbol}>
		Enter Stock Symbol: <input type="text" value={this.state.tempymbol} onChange={this.handleChange} />
		<input type="submit" value="Submit" />
		</form>
		<br />
		<button type="button" onClick={this.getStockInfo}> Get info from Alpha Vantage </button>
		<br />
		<h3> Stock info from API </h3>
		<div>
		
		Symbol: {this.state.symbol} 
		Price: {this.state.price} 
		 Volume: {this.state.volume}
		
		</div>
		<button type="button" onClick={this.setStockInfo}> Set stock information in smart contract </button>
		<br />
		<button type = "button" onClick={this.getStockPrice}> Retrieve stock price from smart contract </button>
		<br />
		<button type = "button" onClick={this.getStockVolume}> Retrieve stock volume from smart contract </button>
		<br />
		<h3> Stock info from Oracle </h3>
		<div>
		<li> Stock price retrieved from smart contract: {this.state.priceFromContract} </li>
		<br />
		<li>Stock volume retrieved from smart contract: {this.state.volumeFromContract}</li>
		</div>
		</div>
		</div>
	);
}
}
export default Stocks;
