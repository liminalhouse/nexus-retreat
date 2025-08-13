'use client'

import React, { useState } from 'react'
import styles from './password-input.module.scss'

interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    test?: string
}

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    const [focused, setFocused] = useState(false)

    return (
        <input
            type="password"
            {...props}
            onFocus={(e) => {
                setFocused(true)
                props.onFocus?.(e)
            }}
            onBlur={(e) => {
                setFocused(false)
                props.onBlur?.(e)
            }}
            style={{
                ...props.style,
                borderColor: focused ? '#0070f3' : 'transparent',
            }}
            // className={styles.input}
        />
    )
}

export default PasswordInput
