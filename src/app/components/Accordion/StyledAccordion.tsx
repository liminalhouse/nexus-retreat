'use client'

import { Accordion, AccordionProps } from '@szhsin/react-accordion'
import styles from './accordion.module.scss'

const StyledAccordion: React.FC<AccordionProps> = ({ children, ...rest }) => {
    return (
        <Accordion className={styles.accordion} allowMultiple={true} {...rest}>
            {children}
        </Accordion>
    )
}

export default StyledAccordion
