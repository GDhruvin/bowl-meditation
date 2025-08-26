import Svg, { Path, Circle } from "react-native-svg";

const MeditationIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Circle
      cx="256"
      cy="256"
      r="200"
      fill="none"
      stroke={color}
      strokeWidth="24"
    />

    <Path
      d="M160 220 q40 30 80 0"
      stroke={color}
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M272 220 q40 30 80 0"
      stroke={color}
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
    />

    <Path
      d="M180 320 q76 80 152 0"
      stroke={color}
      strokeWidth="20"
      fill="none"
      strokeLinecap="round"
    />

    <Path
      d="M240 80 q16 -40 40 0"
      stroke={color}
      strokeWidth="12"
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

export default MeditationIcon;
