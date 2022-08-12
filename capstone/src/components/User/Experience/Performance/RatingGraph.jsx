import { VictoryChart, VictoryBar, VictoryLabel } from 'victory';
import determineColor from '../../Experience/Performance/determineColor';

export default function RatingGraph({ data }) {
  return (
    <VictoryChart domainPadding={40}>
      <VictoryBar
        barRatio={0.8}
        style={{
          labels: {
            fill: ({ datum }) => determineColor(datum.score),
            fontSize: 15,
          },
          data: {
            fill: ({ datum }) => determineColor(datum.score),
          },
        }}
        data={data}
        labels={({ datum }) => datum.count}
        labelComponent={<VictoryLabel dy={-10} />}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 },
        }}
        x="score"
        y="count"
      />
    </VictoryChart>
  );
}
