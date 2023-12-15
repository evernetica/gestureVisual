import React, { FC } from "react";
// import Fonts from "../../../styles/Fonts";
// import Colors from "../../../styles/Colors";
import styled from "styled-components/native";
import { MarginTypes } from "./commonInterfaces";
import { marginStyles } from "./commonStyles";

type TextInterface = MarginTypes & {
  width?: string;
  height?: string;
  lineHeight?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  children: string | number;
  fontWeight?: number;
  textAlign?: string;
  letterSpacing?: string;
  textDecoration?: string | boolean;
  overflow?: string;
  bg?: string;
  pr?: string;
  pl?: string;
  ellipsizeMode?: string;
  numberOfLines?: number;
  flexShrink?: number;
  textTransform?: string;
};

const StyledText = styled.Text<TextInterface>`
  ${marginStyles};
  ${({ width }): string | undefined => width && `width: ${width}`};
  ${({ fontWeight }): number | undefined => fontWeight && `font-weight: ${fontWeight}`};
  ${({ textAlign }): string | undefined => textAlign && `text-align: ${textAlign}`};
  ${({ width }): string | undefined => width && `width: ${width}`};
  ${({ height }): string | undefined => height && `height: ${height}`};
  ${({ letterSpacing }): string | undefined => letterSpacing && `letter-spacing: ${letterSpacing}`};
  ${({ lineHeight }): string | undefined => lineHeight && `line-height: ${lineHeight}`};
  ${({ overflow }): string | undefined => overflow && `overflow: ${overflow}`};
  ${({ bg }): string | undefined => bg && `background-color: ${bg}`};
  ${({ pr }): string | undefined => pr && `padding-right: ${pr}`};
  ${({ pl }): string | undefined => pl && `padding-left: ${pl}`};
  ${({ pb }): string | undefined => pb && `padding-bottom: ${pb}`};
  font-size: ${({ fontSize }): string => fontSize || "14px"};
  ${({ flexShrink }): string | undefined => flexShrink && `flex-shrink: ${flexShrink}`};
  ${({ textTransform }): string | undefined => textTransform && `text-transform: ${textTransform}`};
`;

export const Text: FC<TextInterface> = ({ children, ...rest }) => (
  <StyledText {...rest}>{children}</StyledText>
);
