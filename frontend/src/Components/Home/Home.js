/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import '../../App.css'
import { Link } from 'react-router-dom'
import { Badge, Row, Col, Switch, Card, Divider, Button, InputNumber, message } from 'antd';
import swal from 'sweetalert'



class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ethical: false,
            growth: false,
            index: false,
            quality: false,
            value: false,
            strategies: [],
            amount: null,
            msg:null

        }
    }

    changeAmount = (e) => {
        if(e<1000){
            this.setState({
                amount:e,
                msg:"Below 1000"
            })
        }else{
            this.setState({
                amount: e,
                msg:null
            })
        }
    }

    toggleStrategy = (e) => {
        let id = e.target.id
        if (this.state[id]) {
            let strategies = this.state.strategies
            strategies = strategies.filter(value => {
                return value !== id;
            })
            this.setState({
                [id]: !this.state[id],
                strategies: strategies
            }, () => {
                console.log(this.state.strategies)
                if (this.state.ethical + this.state.growth + this.state.index + this.state.quality + this.state.value > 2) {
                    strategies = strategies.filter(value => {
                        return value !== id;
                    })
                    swal("Only 2 strategies can be selected")
                    this.setState({
                        [id]: !this.state[id],
                        strategies: strategies
                    }, () => {
                        console.log(this.state.strategies)
                    })

                }
            })
        } else if (!this.state[id]) {
            let strategies = this.state.strategies
            strategies.push(id.toString())
            this.setState({
                [id]: !this.state[id],
                strategies: strategies
            }, () => {
                console.log(this.state.strategies)
                if (this.state.ethical + this.state.growth + this.state.index + this.state.quality + this.state.value > 2) {
                    strategies.pop(id.toString())
                    swal("","Only 2 strategies can be selected","error")
                    this.setState({
                        [id]: !this.state[id],
                        strategies: strategies
                    }, () => {
                        console.log(this.state.strategies)
                    })

                }
            })
        }

    }

    invest = (e) => {
        this.props.history.push({
            pathname: '/suggest',
            state: {
                strategies: this.state.strategies,
                amount: parseFloat(this.state.amount)
            }
        })
    }
    render() {

        var ethicalButton = null
        var growthButton = null
        var indexButton = null
        var qualityButton = null
        var valueButton = null
        var msg = null

        if(this.state.msg){
            msg = "Investment amount should be greater than $5000"
        }

        if (this.state.ethical)
            ethicalButton = <center><Button id="ethical" onClick={this.toggleStrategy} type="primary" block>Selected</Button></center>
        else
            ethicalButton = <center><Button id="ethical" onClick={this.toggleStrategy} block>Select</Button></center>
        if (this.state.growth)
            growthButton = <center><Button id="growth" onClick={this.toggleStrategy} type="primary" block>Selected</Button></center>
        else
            growthButton = <center><Button id="growth" onClick={this.toggleStrategy} block>Select</Button></center>
        if (this.state.index)
            indexButton = <center><Button id="index" onClick={this.toggleStrategy} type="primary" block>Selected</Button></center>
        else
            indexButton = <center><Button id="index" onClick={this.toggleStrategy} block>Select</Button></center>
        if (this.state.value)
            valueButton = <center><Button id="value" onClick={this.toggleStrategy} type="primary" block>Selected</Button></center>
        else
            valueButton = <center><Button id="value" onClick={this.toggleStrategy} block>Select</Button></center>
        if (this.state.quality)
            qualityButton = <center><Button id="quality" onClick={this.toggleStrategy} type="primary" block>Selected</Button></center>
        else
            qualityButton = <center><Button id="quality" onClick={this.toggleStrategy} block>Select</Button></center>
        return (
            <div class="bg">
                <div class="px-3 pt-3">
                    <center>
                        <Link to="/"><h1 class="text-info-overlap">STOCK PORTFOLIO SUGGESTION ENGINE</h1></Link>
                    </center>
                    <Divider></Divider>
                </div>
                <div class="px-2 py-2" align="center">
                    <h4 class="text-secondary1">Enter the Amount(in dollars) you want to Invest:</h4>
                    <InputNumber
                        step={100}
                        style={{ width: '40%', height: 35 }}
                        onChange={this.changeAmount}
                    ></InputNumber>
                    <p class="text-danger">{msg}</p>
                </div>
                <div class="px-2 py-2" align="center">
                    <h4 class="text-secondary1" >Select upto two Investment Strategies :</h4>
                    <Row type="flex">
                        <Col span={2}></Col>
                        <Col span={4}>
                            <div class="px-2 py-2">
                                <Card
                                    bordered={true}
                                    title="Ethical Investing"
                                    style={{ width: 200 }}
                                >
                                    {ethicalButton}
                                </Card>
                            </div>
                        </Col>
                        <Col span={4}>
                            <div class="px-2 py-2">
                                <Card
                                    bordered={true}
                                    title="Growth Investing"
                                    style={{ width: 200 }}
                                >
                                    {growthButton}
                                </Card>
                            </div>
                        </Col>
                        <Col span={4}>
                            <div class="px-2 py-2">
                                <Card
                                    bordered={true}
                                    title="Index Investing"
                                    style={{ width: 200 }}
                                >
                                    {indexButton}
                                </Card>
                            </div>
                        </Col>
                        <Col span={4}>
                            <div class="px-2 py-2">
                                <Card
                                    bordered={true}
                                    title="Quality Investing"
                                    style={{ width: 200 }}
                                >
                                    {qualityButton}
                                </Card>
                            </div>
                        </Col>
                        <Col span={4}>
                            <div class="px-2 py-2">
                                <Card
                                    bordered={true}
                                    title="Value Investing"
                                    style={{ width: 200 }}
                                >
                                    {valueButton}
                                </Card>
                            </div>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                </div>
                <div class="px-2 py-2">
                    <center style={{paddingTop: 50}}>
                        <Button
                            type="primary"
                            style={{ width: 500, height: 50 }}
                            //disabled={this.state.strategies.length < 1 || this.state.strategies.length > 2 || this.state.amount < 5000}
                            onClick={this.invest}
                        >Invest</Button>
                    </center>
                </div>
            </div>
        )
    }
}

export default Home;