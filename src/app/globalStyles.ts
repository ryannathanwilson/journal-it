'use client'
import { color } from '@/theme'
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  html,
  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background-color: ${color.navy};
    color: ${color.cream.light};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Times New Roman', Times, serif;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ul,
  li {
    min-width: 0;
  }
`
