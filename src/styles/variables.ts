export const SCREEN_SM_MIN = 768;
export const SCREEN_MD_MIN = 992;
export const SCREEN_LG_MIN = 1200;

export const GRID_GUTTER_WIDTH = 30;
// export const GRID_INNER_PADDING = 20;
// export const INDENT_SM_PX = `${GRID_GUTTER_WIDTH / 2}px`;
// export const INDENT_MD_PX = `${GRID_INNER_PADDING}px`;
// export const INDENT_LG_PX = `${GRID_GUTTER_WIDTH}px`;

// So media queries don't overlap when required, provide a maximum
// export const SCREEN_XS_MAX = SCREEN_SM_MIN - 1;
// export const SCREEN_SM_MAX = SCREEN_MD_MIN - 1;
// export const SCREEN_MD_MAX = SCREEN_LG_MIN - 1;

export const LAYOUT_SM = 720 + GRID_GUTTER_WIDTH;
export const LAYOUT_MD = 940 + GRID_GUTTER_WIDTH;
export const LAYOUT_LG = 1140 + GRID_GUTTER_WIDTH;

export const withPX = (num: number): string => `${num}px`;

export const fluidMediaQueries = `
  @media (min-width: ${withPX(SCREEN_SM_MIN)}) {
    max-width: ${withPX(LAYOUT_SM)};
  }
  @media (min-width: ${withPX(SCREEN_MD_MIN)}) {
    max-width: ${withPX(LAYOUT_MD)};
  }
  @media (min-width: ${withPX(SCREEN_LG_MIN)}) {
    max-width: ${withPX(LAYOUT_LG)};
  }
`;

export const fluidStyles = `
  max-width: 100%;
  ${fluidMediaQueries}
  margin-right: auto;
  margin-left: auto;
  padding-right: ${withPX(Math.ceil(GRID_GUTTER_WIDTH / 2))};
  padding-left: ${withPX(Math.ceil(GRID_GUTTER_WIDTH / 2))};
`;
