import Svg, { Path, Circle } from "react-native-svg";

const YogasIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Circle
      cx="256"
      cy="128"
      r="48"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <Path
      d="M208,192c-48,0-80,48-80,96v64h256v-64c0-48-32-96-80-96h-48Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <Path
      d="M176,288c0,26.51 21.49,48 48,48h64c26.51,0 48,-21.49 48,-48"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
  </Svg>
);

export default YogasIcon;
