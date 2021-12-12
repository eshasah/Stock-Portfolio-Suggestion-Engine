import React, { Component } from 'react';
import Graph from './Graph';
import Table from 'react-bootstrap/Table'
import { Skeleton, Empty, Button } from 'antd';

export class Stats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "profileview",
            stockdata: null,
            companies: [],
            "error": null
        }
    }

    componentDidMount() {

        const strategies = this.props.location.state.strategies
        const amount = this.props.location.state.amount


            const data = JSON.stringify({
                "amount": amount,
                "strategies": strategies
            });
            
            console.log(data);

            fetch("http://localhost:5000/stocks", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data
            })
            .then(async response => {
                const result = await response.json();
                if (response.ok) {
                    console.log(result);
                    this.setState({
                        companies: result
                    })
                    console.log(response.data);
                    console.log(this.state.companies);
                }
            })
            .catch(err => {
                console.log("error")
                this.setState({
                    error: "couldn't fetch data"
                })
            })

    }

    render() {

        let companies = [];
        companies = this.state.companies

        Object.keys(companies).map((index, key) => {
            console.log(index + " " + companies[index].currentPrice)
        });


        let skeleton = null
        let error = null
        if (companies.length === 0 || !companies) {
            skeleton = <Skeleton active />
        } else {
            skeleton = null
        }

        if (this.state.error) {
            error = <Empty description="Couldn't fetch data, try again by refreshing after a minute!" />
            skeleton=null
        }
        return (
            <div className="stats">
                <center><h1>Stocks Suggestion</h1></center><br />
                <div>
                    <Table striped bordered hover className='table-font'>
                        <thead className='bg'>
                            <tr className='text-secondary1'>
                                <th>Symbol</th>
                                <th>Stock Value</th>
                                <th>P/E Ratio</th>
                                <th>Amount to Invest</th>
                                <th>Trend (Last 5 days)</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {Object.keys(companies).map((index, details) => {

                                return <tr key={index}>
                                    <td><b>{index}</b></td>
                                    <td>${companies[index].currentPrice}</td>
                                    <td>{companies[index].peRatio}</td>
                                    <td>${companies[index].amount_to_spend}</td>
                                    <td><Graph data={companies[index].history}></Graph></td>
                                </tr>
                            })
                            }
                        </tbody>
                    </Table>
                    {error}
                    {skeleton}
                </div>
                <Button size="large" onClick={() =>  {window.location.assign("/")}} className="mx-3 my-3 px-3 center">Back</Button>
                <Button size="large" onClick={() =>  window.print()} className="mx-3 my-3 px-3 center">Print Data</Button>
            </div>
        )
    }
}

export default Stats
