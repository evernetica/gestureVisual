import React, { FC } from "react";
import styled from "styled-components/native";

type ImageInterface = {
  imageWidth?: string;
  imageHeight?: string;
  display?: string;
  resizeMode: string;
  onError: () => void;
  onLoad: () => void;
  source: { uri: string } | React.ReactNode;
};

const StyledImage = styled.Image<ImageInterface>`
  width: ${({ imageWidth }): string => imageWidth || "50px"};
  height: ${({ imageHeight }): string => imageHeight || "50px"};
  ${({ display }): string | null => (display && `display: ${display}`) || null};
`;

export const Image: FC<ImageInterface> = ({ source, resizeMode, ...rest }) => (
  <StyledImage source={source} resizeMode={resizeMode} {...rest} />
);
