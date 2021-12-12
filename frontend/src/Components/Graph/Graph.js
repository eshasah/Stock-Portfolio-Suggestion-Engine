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


   addDays = (date, days) => {
    
    let newdate = new Date(date);

    newdate.setDate(newdate.getDate() + days);
    
    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var y = newdate.getFullYear();

    var someFormattedDate = mm + '/' + dd + '/' + y;
    return someFormattedDate
}
  render() {

    //const data = this.props.data.slice(50,100);
    console.log("history: " + this.state.historyData);
    const currentDate = new Date();
    console.log(currentDate.toLocaleDateString());
    let strokeColor = this.state.historyData[3] <= this.state.historyData[4] ? "#008000" : "#D22B2B"
    
                    let data = []
                    const low = Math.floor(Math.min(...this.state.historyData))-10;
                    const high = Math.ceil(Math.max(...this.state.historyData))+10;

                    Object.keys(this.state.historyData).map((key) => {
                      let date = this.addDays(currentDate, key - 5);
                      console.log("date" + key + ": " + date);
                        data.push({
                            "day": date,
                            "val": this.state.historyData[key],
                            "low": this.state.low
                        })
                    });

                    data.map((idx) => {console.log("line graph data: " + data[idx]);});
               

    return (
      <div className="profileview mb-3">
        <LineChart className="stock-trend-wrapper" width={700} height={300} data={data} >
          <Line type="monotone" dataKey="val" stroke={strokeColor}/>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="day" />
          <YAxis dataKey="val"  domain={[low, high]}/>
          <Tooltip />
        </LineChart>
      </div>
    )
  }
}

export default Graph
