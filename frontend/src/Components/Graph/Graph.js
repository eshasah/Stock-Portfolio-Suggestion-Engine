import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export class Graph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentDateTime: Date().toLocaleString(),
      historyData: this.props.data,
    }

  }
  render() {

    //const data = this.props.data.slice(50,100);
    console.log("history: " + this.state.historyData);
    const currentDate = new Date(Date.now());
            
    
                    let data = []
                    const low = Math.min(...this.state.historyData);
                    Object.keys(this.state.historyData).map((key) => {
                        data.push({
                            "day": currentDate.getDate() - 5 + key,
                            "val": this.state.historyData[key],
                            "low": this.state.low
                        })
                    });

                    data.map((idx) => {console.log("line graph data: " + data[idx]);});
               

    return (
      <div className="profileview mb-3">Stock Price
        <LineChart width={1100} height={300} data={data} >
          <Line type="monotone" dataKey="val" stroke="#8884d8"/>
          {/* <CartesianGrid stroke="#ccc" /> */}
          <XAxis dataKey="day" />
          <YAxis dataKey="val" />
          <Tooltip />
        </LineChart>
      </div>
    )
  }
}

export default Graph
