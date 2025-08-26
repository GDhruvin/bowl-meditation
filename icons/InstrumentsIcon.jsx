import Svg, { Path } from "react-native-svg";

const InstrumentsIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      d="M96,352c0,44.18 35.82,80 80,80h160c44.18,0 80,-35.82 80,-80V192H96"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <Path
      d="M128,352c0,26.51 21.49,48 48,48h160c26.51,0 48,-21.49 48,-48"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
    <Path
      d="M256,448v32"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
  </Svg>
);

export default InstrumentsIcon;
