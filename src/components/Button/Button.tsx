import * as React from 'react';
import { RIDITheme } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import styled, { Interpolation } from '@emotion/styled';

interface ButtonProps {
  label: string | React.ReactNode;
  type: 'primary' | 'secondary';
  wrapperCSS?: Interpolation;
}

const StyledButton = styled.button<{ buttonStyle: 'primary' | 'secondary' }, RIDITheme>`
  box-sizing: border-box;
  background-color: ${(props) => props.theme.button[`${props.buttonStyle}Background`]};
  border: 1px solid ${(props) => props.theme.button[`${props.buttonStyle}BorderColor`]};
  border-radius: 3px;
  padding: 0 16px;
  font-weight: bold;
  color: ${(props) => props.theme.button[`${props.buttonStyle}FontColor`]};
  word-break: keep-all;
  font-size: 13px;
  height: 30px;

  ${orBelow(BreakPoint.LG, 'padding: 0 8px;')};
  :hover {
    opacity: 0.7;
  }
  transition: all 0.2s ease-in-out;
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
`;

export const Button: React.FC<ButtonProps> = (props) => (
  <StyledButton buttonStyle={props.type} css={props.wrapperCSS}>{props.label}</StyledButton>
);
