import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      color="#000000"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M20 1H4a3 3 0 00-3 3v10a3 3 0 003 3h16a3 3 0 003-3V4a3 3 0 00-3-3zm1 13a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h16a1 1 0 011 1zm-2-2a1 1 0 01-1 1H6a1 1 0 010-2h12a1 1 0 011 1zm0-6a1 1 0 01-1 1h-2a1 1 0 010-2h2a1 1 0 011 1zm-9 0a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1zM5 6a1 1 0 011-1h2a1 1 0 010 2H6a1 1 0 01-1-1zm14 3a1 1 0 01-1 1h-2a1 1 0 010-2h2a1 1 0 011 1zm-9 0a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1zM5 9a1 1 0 011-1h2a1 1 0 010 2H6a1 1 0 01-1-1zm9.707 10.293a1 1 0 010 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L12 20.586l1.293-1.293a1 1 0 011.414 0z" />
    </Svg>
  );
}

export default SvgComponent;
