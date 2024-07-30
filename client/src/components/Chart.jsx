import React, { Component, memo } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints: []
    };
    this.chartDataPoints = this.chartDataPoints.bind(this);
  }

  componentDidMount() {
    this.chartDataPoints();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.history !== this.props.history) {
      this.chartDataPoints();
    }
  }

  chartDataPoints() {
    const chartArray = this.props.history.map((obj) => {
      return { x: new Date(obj.timestamp), y: obj.price };
    });
    this.setState({ dataPoints: chartArray }, () => {
      if (this.chart) {
        this.chart.render();
      }
    });
  }

  render() {
    const options = {
      theme: this.props.lightMode,
      title: {
        text: ``,
      },
      data: [{
        type: "line",
        xValueFormatString: "HH.mm.TT",
        yValueFormatString: "#,###",
        dataPoints: this.state.dataPoints
      }]
    };

    return (
      <div style={{ margin: "6px 8px"}}>
        <CanvasJSChart options={options}
          onRef={ref => this.chart = ref}
        />
      </div>
    );
  }
}

export default memo(Chart);