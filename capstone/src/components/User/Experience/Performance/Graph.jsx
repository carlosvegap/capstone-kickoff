import { VictoryChart, VictoryBar, VictoryLabel } from 'victory';

export default function Graph({data, determineColor}) {
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
        // data accessor for x values
        x="score"
        // data accessor for y values
        y="count"
      />
    </VictoryChart>
  );
}