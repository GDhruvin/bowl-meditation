import Svg, { Path } from "react-native-svg";

const SoundIcon = ({ focused, color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d={
        "M13.5 20.25C13.5 21.9075 11.745 23.25 9.75 23.25C7.755 23.25 6 21.9075 6 20.25C6 18.5925 7.755 17.25 9.75 17.25C11.745 17.25 13.5 18.5925 13.5 20.25ZM13.5 4.5V15H12V4.5H13.5ZM12 3.93C12 3.3525 12.504 3 13.206 3.03L18 3.45C18.702 3.48 19.5 4.1325 19.5 4.83V6L12 6.75V3.93Z" // Outline (same as filled but can add stroke if needed; adjust in style if desired)
      }
      fill={color}
    />
  </Svg>
);

export default SoundIcon;
