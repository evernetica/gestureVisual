import styled from "styled-components/native";
import { MarginTypes } from "./commonInterfaces";
import { marginStyles, paddingStyles } from "./commonStyles";

type ScrollViewInterface = MarginTypes & {
  height?: string;
  width?: string;
  flex?: number;
  bg?: string;
  flexDirection?: string;
};

export const StyledScrollView = styled.ScrollView<ScrollViewInterface>`
  ${marginStyles};
  ${paddingStyles};
  ${({ height }): string | undefined => height && `height: ${height}`};
  ${({ width }): string | undefined => width && `width: ${width}`};
  ${({ flex }): number | undefined => flex && `height: ${flex}`};
  ${({ bg }): string | undefined => bg && `background-color: ${bg}`};
  ${({ flexDirection }): string | undefined => flexDirection && `flex-direction: ${flexDirection}`};
`;
