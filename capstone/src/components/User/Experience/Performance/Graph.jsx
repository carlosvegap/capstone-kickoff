import { VictoryChart, VictoryBar, VictoryLabel } from 'victory';

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 },
  { quarter: 5, earnings: 20000 },
];

export default function Graph({determineColor}) {
  return (
    <VictoryChart domainPadding={40}>
      <VictoryBar
        barRatio={0.8}
        style={{
          labels: {
            fill: ({ datum }) => determineColor(datum.quarter),
            fontSize: 15,
          },
          data: {
            fill: ({ datum }) => determineColor(datum.quarter),
          },
        }}
        data={data}
        labels={({ datum }) => datum.earnings}
        labelComponent={<VictoryLabel dy={-10} />}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 },
        }}
        // data accessor for x values
        x="quarter"
        // data accessor for y values
        y="earnings"
      />
    </VictoryChart>
  );
}