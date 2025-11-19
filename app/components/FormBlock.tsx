import Form from './Form'
import type {FormConfig} from './Form/types'

interface FormBlockProps {
  block: FormConfig
}

export default function FormBlock({block}: FormBlockProps) {
  return (
    <div className="py-12 px-4">
      <Form config={block} showLogo={false} showProgress={true} />
    </div>
  )
}
