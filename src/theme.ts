'use client'
import { Geist } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const body = Geist({
    variable: '--font-body',
    subsets: ['latin'],
})
const theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#192947',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
    typography: {
        fontFamily: body.style.fontFamily,
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { severity: 'info' },
                            style: {
                                backgroundColor: '#60a5fa',
                            },
                        },
                    ],
                },
            },
        },
    },
})

export default theme
