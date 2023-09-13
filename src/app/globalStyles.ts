'use client'
import { color } from '@/theme'
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  body {
    overflow-x: hidden;
    position: relative;
    background-color: ${color.navy};
    color: ${color.cream.light};
    padding: 1rem;
    @media (min-width: 600px) {
      padding: 6rem;
    }
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
    font-family: Arial, Helvetica, sans-serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ul,
  li {
    min-width: 0;
  }
`
