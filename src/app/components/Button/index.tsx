import styles from './button.module.scss'

const Button = ({
    children,
    ...rest
}: {
    children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button className={styles.button} {...rest}>
            {children}
        </button>
    )
}

export default Button
