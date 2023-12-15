import { css } from "styled-components/native";
import { MarginTypes, PaddingTypes } from "./commonInterfaces";

export const marginStyles = css<MarginTypes>`
  ${({ mt }): string | undefined => mt && `margin-top: ${mt}`};
  ${({ mr }): string | undefined => mr && `margin-right: ${mr}`};
  ${({ mb }): string | undefined => mb && `margin-bottom: ${mb}`};
  ${({ ml }): string | undefined => ml && `margin-left: ${ml}`};
`;
export const paddingStyles = css<PaddingTypes>`
  ${({ pt }): string | undefined => pt && `padding-top: ${pt}`};
  ${({ pb }): string | undefined => pb && `padding-bottom: ${pb}`};
  ${({ pr }): string | undefined => pr && `padding-right: ${pr}`};
  ${({ pl }): string | undefined => pl && `padding-left: ${pl}`};
`;
