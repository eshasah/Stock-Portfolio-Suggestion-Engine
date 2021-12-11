import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Graph from './Graph';
import axios from 'axios';
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

        // const data = this.props.strategies
        // const prop = ["ethical"]
        const strategies = this.props.location.state.strategies
        const amount = this.props.location.state.amount


        if (strategies.length === 1) {
            const data = {
                "amount": amount,
                "strategy_1": strategies[0]
            }

            axios.post('http://localhost:5000/suggest', data)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            companies: response.data.stock_info
                        })
                    }
                })
                .catch(err => {
                    console.log("error")
                    this.setState({
                        error: "couldn't fetch data"
                    })
                })
        } else if (strategies.length === 2) {
            const data = {
                "amount": amount,
                "strategy_1": strategies[0],
                "strategy_2": strategies[1]
            }


            axios.post('http://localhost:5000/suggest2', data)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            companies: response.data.stock_info
                        })
                    }
                })
                .catch(err => {
                    console.log("error")
                    this.setState({
                        error: "couldn't fetch data"
                    })
                })
        }
    }

    render() {
        let companies = this.state.companies
        let tabs = null
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
        if (companies.length > 0) {
            tabs = <Tabs
                id="controlled-tab-example"
                activeKey={this.state.key}
                onSelect={key => this.setState({ key })}
            >
                {companies.map((company, index) => {
                    // let weeklyData = Object.keys(company.weeklyData)
                    let weeklyData = company.weeklyData
                    let data = []
                    Object.keys(weeklyData).map((key) => {
                        data.push({
                            "day": key,
                            "high": weeklyData[key]["2. high"],
                            "low": weeklyData[key]["3. low"]
                        })
                    });
                    return <Tab key={index} eventKey={company.symbolName} title={company.companyName}>
                        <Graph data={data} />
                    </Tab>
                })
                }
            </Tabs>
        }
        return (
            <div className="stats">
                <h4>Stocks Suggestion</h4><br />
                
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Symbol</th>
                            <th>Company</th>
                            <th>Stock Value</th>
                            <th>Change(%)</th>
                            <th>Invested Amount</th>
                        </tr>
                    </thead>
                    
                    <tbody>

                        {companies.map((company, index) => {

                            return <tr key={index}>
                                <td>{index + 1}</td>
                                <td><b>{company.symbolName}</b></td>
                                <td><b>{company.companyName}</b></td>
                                <td>${company.latestPrice.toFixed(4)}</td>
                                <td>{company.changePercentage.toFixed(2)}%</td>
                                <td>${company.investAmount.toFixed(4)}</td>
                            </tr>
                        })
                        }
                    </tbody>
                </Table>
                {error}
                {skeleton}
                <br></br>
                <h4>Stock Report</h4><br />
                {tabs}
                {skeleton}
                {error}
                <Button size="large" onClick={() =>  window.print()} className="mx-3 my-3 px-3 center">Print Data</Button>
            </div>
        )
    }
}

export default Stats
