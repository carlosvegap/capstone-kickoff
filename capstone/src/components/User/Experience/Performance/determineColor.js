export default function determineColor(value) {
  switch (value) {
    case 1:
      return '#E53E3E';
    case 2:
      return '#DD6B20';
    case 3:
      return '#ECC94B';
    case 4:
      return '#68D391';
    case 5:
      return '#38B2AC';
    default:
      return '#0000000';
  }
}
