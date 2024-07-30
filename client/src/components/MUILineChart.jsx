import { useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import usePriceHistory from '../hooks/usePriceHistory'


export default function MUILineChart({ investment }) {
    const { historyData, error: historyError } = usePriceHistory(investment);

    const xData = historyData?.history.map(obj => {
        const time = new Date(obj.timestamp);
        const timeArray = time.toLocaleTimeString().split(":");
        return (timeArray.slice(0, 2).join(":"));           
    })
    const yData = historyData?.history.map(obj => obj.price)


    return (
        <div>

            {xData && yData &&
            <LineChart
            xAxis={[{ data: xData }]}
            series={[
                {
                data: yData,
                },
            ]}
            width={500}
            height={300}
            />
            }
        </div>
      );
}