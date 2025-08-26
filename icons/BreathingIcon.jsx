import Svg, { Path } from "react-native-svg";

const BreathingIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      d="M321.89,171.42C233,114,141,155.22,56,65.22c-19.8-21-8.3,235.5,98.1,332.7C231.89,468.92,352,461,392.5,392S410.78,228.83,321.89,171.42Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <Path
      d="M173,253c86,81,175,129,292,147"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <Path
      d="M256,200c40,60,80,100,120,120"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
  </Svg>
);

export default BreathingIcon;
