import { auth } from './actions'
import styles from './sign-in.module.scss'
import Image from 'next/image'
import PasswordInput from '@/components/PasswordInput'
import Button from '@/components/Button'

const UI = ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
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
                <input
                    name="redirect"
                    type="hidden"
                    defaultValue={searchParams.redirect}
                />
                <label>
                    <PasswordInput
                        name="password"
                        required={true}
                        autoFocus={true}
                        placeholder="Enter the event password..."
                    />
                </label>
                <Button type="submit">Enter</Button>
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
