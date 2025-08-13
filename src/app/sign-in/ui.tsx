'use client'

import { auth } from './actions'
import styles from './sign-in.module.scss'
import Image from 'next/image'
import { Input, Button, InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'

const UI = ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const handleMouseDownPassword = () => setShowPassword(!showPassword)

    return (
        <div className={styles.wrapper}>
            <Image
                src="/icons/nexus-logo.svg"
                alt="Bruin Nexus logo"
                width={1180 / 4}
                height={258 / 4}
                priority={true}
                className={styles.logo}
            />
            <p className={styles.text}>
                This event is invitation-only. To access the website, please
                enter the password provided in your invitation email.
            </p>
            <form action={auth} className={styles.form}>
                <div className={styles.inputGroup}>
                    <div className={styles.inputWrapper}>
                        <input
                            name="redirect"
                            type="hidden"
                            defaultValue={searchParams.redirect}
                        />
                        <Input
                            id="pw-input"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required={true}
                            autoFocus={true}
                            placeholder="Enter password..."
                            style={{ width: '100%' }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <span className={styles.bar} />
                    </div>
                </div>
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
                {!!searchParams.redirect && (
                    <small className={styles.error}>
                        Password incorrect. Please try again.
                    </small>
                )}
            </form>
        </div>
    )
}

export default UI
