import React, { FC } from "react";
import styled from "styled-components/native";
import { marginStyles, paddingStyles } from "./commonStyles";
import { BlockInterface } from "./Block";
import { MarginTypes, PaddingTypes } from "./commonInterfaces";

type ButtonInterface = BlockInterface &
  MarginTypes &
  PaddingTypes & {
    onPress: () => void;
    shadowColor?: string;
    shadowOffset?: { height: number; width: number };
    shadowOpacity?: number;
    shadowRadius?: string;
    elevation?: number;
    opacity?: string;
    children: React.ReactNode;
    boxShadow?: string;
  };

const StyledButton = styled.TouchableOpacity<ButtonInterface>`
  ${marginStyles};
  ${paddingStyles};
  ${({ width }): string | undefined => width && `width: ${width}`};
  ${({ height }): string | undefined => height && `height: ${height}`};
  ${({ borderRad }): string | undefined => borderRad && `border-radius: ${borderRad}`};
  ${({ bg }): string | undefined => bg && `background-color: ${bg}`};
  ${({ flexDirection }): string | undefined => flexDirection && `flex-direction: ${flexDirection}`};
  ${({ flexWrap }): string | undefined => flexWrap && `flex-wrap: ${flexWrap}`};
  ${({ flex }): string | undefined => (flex || flex === 0) && `flex: ${flex}`};
  ${({ justifyContent }): string | undefined =>
    justifyContent && `justify-content: ${justifyContent}`};
  ${({ alignItems }): string | undefined => alignItems && `alignItems: ${alignItems}`};
  ${({ alignSelf }): string | undefined => alignSelf && `align-self: ${alignSelf}`};
  ${({ shadowColor }): string | undefined => shadowColor && `shadow-color: ${shadowColor}`};
  ${({ opacity }): string | undefined => opacity && `opacity: ${opacity}`};
  ${({ shadowOffset }): { height: string; width: string } | undefined =>
    shadowOffset && `shadow-offset: {width: ${shadowOffset.width}, height: ${shadowOffset.height}`};
  ${({ shadowOpacity }): number | undefined => shadowOpacity && `shadow-opacity: ${shadowOpacity}`};
  ${({ shadowRadius }): number | undefined => shadowRadius && `shadow-radius: ${shadowRadius}`};
  ${({ boxShadow }): string | undefined => boxShadow && `box-shadow: ${boxShadow}`};
  ${({ elevation }): number | undefined => elevation && `elevation: ${elevation}`};
  ${({ position }): number | undefined => position && `position: ${position}`};
  ${({ bottom }): number | undefined => bottom && `bottom: ${bottom}`};
  ${({ right }): number | undefined => right && `right: ${right}`};
  ${({ borderRightColor, borderRightWidth }): string | undefined =>
    borderRightColor &&
    borderRightWidth &&
    `border-right-color: ${borderRightColor}; border-right-width: ${borderRightWidth}`};
  ${({ borderBottomColor, borderBottomWidth }): string | undefined =>
    borderBottomColor &&
    borderBottomWidth &&
    `border-bottom-color: ${borderBottomColor}; border-bottom-width: ${borderBottomWidth}`};
`;

let disabled = false;
export const Button: FC<ButtonInterface> = ({ children, onPress, ...rest }) => {
  const callPress = () => {
    if (!disabled) {
      onPress();
      disabled = true;
    }
    setTimeout(() => {
      disabled = false;
    }, 500);
  };
  return (
    <StyledButton onPress={callPress} {...rest}>
      {children}
    </StyledButton>
  );
};
