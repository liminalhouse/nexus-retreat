'use client'

import React from 'react'
import styles from './accordion.module.scss'
import { AccordionItem, AccordionItemProps } from '@szhsin/react-accordion'

const StyledAccordionItem: React.FC<AccordionItemProps> = ({
    header,
    children,
    id,
    ...rest
}) => {
    return (
        <AccordionItem
            className={styles.accordionListItem}
            id={id}
            headingTag="h3"
            header={({ state }) => (
                <>
                    {header} <span>{state.isEnter ? '-' : '+'}</span>
                </>
            )}
            headingProps={{ className: styles.header }}
            contentProps={{ className: styles.content }}
            initialEntered={true}
            {...rest}
        >
            {children}
        </AccordionItem>
    )
}

export default StyledAccordionItem
