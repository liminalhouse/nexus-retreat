'use client'

import React from 'react'
import styles from './accordion.module.scss'
import {
    AccordionItem,
    AccordionItemProps,
    useAccordionItem,
    useAccordionItemEffect,
    useAccordionState,
} from '@szhsin/react-accordion'
import { useSearchParams } from 'next/navigation'

const StyledAccordionItem: React.FC<AccordionItemProps> = ({
    header,
    children,
    id,
    itemKey,
    ...rest
}) => {
    // const { getItemState } = useAccordionState()
    // const { itemRef, state, toggle } = useAccordionItemEffect<HTMLDivElement>({
    //     itemKey,
    // })
    // const { buttonProps, panelProps } = useAccordionItem({
    //     state,
    //     toggle,
    // })
    // const { status, isMounted, isEnter } = state
    const isActive =
        typeof window !== 'undefined' && window?.location?.hash === `#${id}`
    console.log('item state ', id)
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
            // onClick={() => {
            //     window.location.hash = `#${id}`
            // }}
            {...rest}
        >
            {children}
        </AccordionItem>
    )
}

export default StyledAccordionItem
