import {SCREEN_LG_MIN, SCREEN_MD_MIN, SCREEN_SM_MIN, withPX} from './variables';

export const withMediaQueriesSM = (props: string): string => {
  return `
  @media (min-width: ${withPX(SCREEN_SM_MIN)}) {
    ${props}
  }`;
};

export const withMediaQueriesMD = (props: string): string => {
  return `
  @media (min-width: ${withPX(SCREEN_MD_MIN)}) {
    ${props}
  }`;
};

export const withMediaQueriesLG = (props: string): string => {
  return `
  @media (min-width: ${withPX(SCREEN_LG_MIN)}) {
    ${props}
  }`;
};
