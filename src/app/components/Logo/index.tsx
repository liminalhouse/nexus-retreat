'use client'

import MonochromeLogo from '@/components/svg/NexusLogoMonochrome.svg'
import DefaultLogo from '@/components/svg/NexusLogoDefault.svg'

type Props = {
    $logoType?: 'default' | 'white' | 'black'
}

const Logo = ({ $logoType, ...rest }: Props) => {
    if ($logoType === 'default') {
        return <DefaultLogo {...rest} />
    }

    return <MonochromeLogo {...rest} />
}

export default Logo
