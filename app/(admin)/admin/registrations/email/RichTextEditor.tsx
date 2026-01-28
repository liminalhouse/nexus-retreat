'use client'

import {useEditor, EditorContent, ReactRenderer} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import {Extension} from '@tiptap/core'
import Suggestion, {SuggestionProps, SuggestionKeyDownProps} from '@tiptap/suggestion'
import {useCallback, useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {createPortal} from 'react-dom'
import tippy, {Instance as TippyInstance} from 'tippy.js'
import 'tippy.js/dist/tippy.css'

// All available registration variables organized by category
const VARIABLE_CATEGORIES = [
  {
    category: 'Basic Info',
    variables: [
      {key: 'firstName', label: 'First Name'},
      {key: 'lastName', label: 'Last Name'},
      {key: 'fullName', label: 'Full Name'},
      {key: 'email', label: 'Email'},
      {key: 'mobilePhone', label: 'Mobile Phone'},
      {key: 'title', label: 'Title'},
      {key: 'organization', label: 'Organization'},
    ],
  },
  {
    category: 'Address',
    variables: [
      {key: 'addressLine1', label: 'Address Line 1'},
      {key: 'addressLine2', label: 'Address Line 2'},
      {key: 'city', label: 'City'},
      {key: 'state', label: 'State'},
      {key: 'zip', label: 'Zip Code'},
      {key: 'country', label: 'Country'},
    ],
  },
  {
    category: 'Emergency Contact',
    variables: [
      {key: 'emergencyContactName', label: 'Emergency Contact Name'},
      {key: 'emergencyContactRelation', label: 'Emergency Contact Relation'},
      {key: 'emergencyContactEmail', label: 'Emergency Contact Email'},
      {key: 'emergencyContactPhone', label: 'Emergency Contact Phone'},
    ],
  },
  {
    category: 'Executive Assistant',
    variables: [
      {key: 'assistantName', label: 'Assistant Name'},
      {key: 'assistantTitle', label: 'Assistant Title'},
      {key: 'assistantEmail', label: 'Assistant Email'},
      {key: 'assistantPhone', label: 'Assistant Phone'},
    ],
  },
  {
    category: 'Guest',
    variables: [
      {key: 'guestName', label: 'Guest Name'},
      {key: 'guestRelation', label: 'Guest Relation'},
      {key: 'guestEmail', label: 'Guest Email'},
    ],
  },
  {
    category: 'Event Details',
    variables: [
      {key: 'dietaryRestrictions', label: 'Dietary Restrictions'},
      {key: 'jacketSize', label: 'Jacket Size'},
      {key: 'accommodations', label: 'Accommodations'},
      {key: 'dinnerAttendance', label: 'Dinner Attendance'},
      {key: 'activities', label: 'Activities'},
    ],
  },
  {
    category: 'Guest Event Details',
    variables: [
      {key: 'guestDietaryRestrictions', label: 'Guest Dietary Restrictions'},
      {key: 'guestJacketSize', label: 'Guest Jacket Size'},
      {key: 'guestAccommodations', label: 'Guest Accommodations'},
      {key: 'guestDinnerAttendance', label: 'Guest Dinner Attendance'},
      {key: 'guestActivities', label: 'Guest Activities'},
    ],
  },
  {
    category: 'Links',
    variables: [
      {key: 'editLink', label: 'Edit Registration Link'},
      {key: 'activitiesLink', label: 'Edit Activities Link'},
    ],
  },
]

// Flatten variables for searching
const ALL_VARIABLES = VARIABLE_CATEGORIES.flatMap((cat) =>
  cat.variables.map((v) => ({...v, category: cat.category})),
)

type VariableItem = {
  key: string
  label: string
  category: string
}

// Suggestion list component
type SuggestionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean
}

type SuggestionListProps = {
  items: VariableItem[]
  command: (item: VariableItem) => void
}

const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>(
  ({items, command}, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    }

    useImperativeHandle(ref, () => ({
      onKeyDown: ({event}: SuggestionKeyDownProps) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
          return true
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev + 1) % items.length)
          return true
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex)
          return true
        }
        return false
      },
    }))

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    if (items.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-500">
          No matching variables found
        </div>
      )
    }

    // Group items by category for display
    const groupedItems: {category: string; items: {item: VariableItem; globalIndex: number}[]}[] =
      []
    let currentCategory = ''
    items.forEach((item, index) => {
      if (item.category !== currentCategory) {
        currentCategory = item.category
        groupedItems.push({category: currentCategory, items: []})
      }
      groupedItems[groupedItems.length - 1].items.push({item, globalIndex: index})
    })

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto min-w-[250px]">
        {groupedItems.map((group) => (
          <div key={group.category}>
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
              {group.category}
            </div>
            {group.items.map(({item, globalIndex}) => (
              <button
                key={item.key}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-blue-50 ${
                  globalIndex === selectedIndex ? 'bg-blue-100 text-blue-800' : 'text-gray-700'
                }`}
                onClick={() => selectItem(globalIndex)}
              >
                <span>{item.label}</span>
                <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {`{{${item.key}}}`}
                </code>
              </button>
            ))}
          </div>
        ))}
      </div>
    )
  },
)

SuggestionList.displayName = 'SuggestionList'

// Create the variable suggestion extension - using @ as trigger to avoid re-triggering issues
const VariableSuggestion = Extension.create({
  name: 'variableSuggestion',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '@',
        items: ({query}: {query: string}) => {
          const lowerQuery = query.toLowerCase()
          return ALL_VARIABLES.filter(
            (item) =>
              item.label.toLowerCase().includes(lowerQuery) ||
              item.key.toLowerCase().includes(lowerQuery),
          ).slice(0, 15)
        },
        render: () => {
          let component: ReactRenderer<SuggestionListRef> | null = null
          let popup: TippyInstance[] | null = null

          return {
            onStart: (props: SuggestionProps<VariableItem>) => {
              component = new ReactRenderer(SuggestionList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) {
                return
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },

            onUpdate(props: SuggestionProps<VariableItem>) {
              component?.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup?.[0]?.setProps({
                getReferenceClientRect: props.clientRect as () => DOMRect,
              })
            },

            onKeyDown(props: SuggestionKeyDownProps) {
              if (props.event.key === 'Escape') {
                popup?.[0]?.hide()
                return true
              }

              return component?.ref?.onKeyDown(props) ?? false
            },

            onExit() {
              popup?.[0]?.destroy()
              component?.destroy()
            },
          }
        },
        command: ({editor, range, props}: {editor: any; range: any; props: VariableItem}) => {
          // Delete the @query and insert the full variable syntax
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(`{{${props.key}}}`)
            .run()
        },
      }),
    ]
  },
})

type RichTextEditorProps = {
  content: string
  onChange: (html: string) => void
}

// Variable picker dropdown component using portal
function VariablePickerDropdown({
  isOpen,
  onClose,
  onSelect,
  anchorRef,
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (variable: VariableItem) => void
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [position, setPosition] = useState({top: 0, left: 0})

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      })
    }
  }, [isOpen, anchorRef])

  if (!isOpen) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div
        className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto min-w-[280px]"
        style={{top: position.top, left: position.left}}
      >
        {VARIABLE_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0 border-b border-gray-100">
              {cat.category}
            </div>
            {cat.variables.map((variable) => (
              <button
                key={variable.key}
                className="w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-blue-50 text-gray-700"
                onClick={() => {
                  onSelect({...variable, category: cat.category})
                  onClose()
                }}
              >
                <span>{variable.label}</span>
                <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {`{{${variable.key}}}`}
                </code>
              </button>
            ))}
          </div>
        ))}
      </div>
    </>,
    document.body,
  )
}

export default function RichTextEditor({content, onChange}: RichTextEditorProps) {
  const [showVariablePanel, setShowVariablePanel] = useState(false)
  const [mounted, setMounted] = useState(false)
  const variableButtonRef = useState<React.RefObject<HTMLDivElement | null>>(() => ({
    current: null,
  }))[0]

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      VariableSuggestion,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none',
      },
    },
    onUpdate: ({editor}) => {
      onChange(editor.getHTML())
    },
  })

  // Update content when it changes externally (e.g., template selection)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl || 'https://')

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({href: url}).run()
  }, [editor])

  const insertVariable = (variable: VariableItem) => {
    if (!editor) return
    editor.chain().focus().insertContent(`{{${variable.key}}}`).run()
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-md min-h-[250px] bg-gray-50 animate-pulse" />
    )
  }

  return (
    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
            />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 4h4m-2 0l-4 16m0 0h4"
            />
          </svg>
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </ToolbarButton>

        {editor.isActive('link') && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            isActive={false}
            title="Remove Link"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </ToolbarButton>
        )}

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
            <circle cx="2" cy="6" r="1" fill="currentColor" />
            <circle cx="2" cy="12" r="1" fill="currentColor" />
            <circle cx="2" cy="18" r="1" fill="currentColor" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 6h13M7 12h13M7 18h13"
            />
            <text x="1" y="8" fontSize="8" fill="currentColor">
              1
            </text>
            <text x="1" y="14" fontSize="8" fill="currentColor">
              2
            </text>
            <text x="1" y="20" fontSize="8" fill="currentColor">
              3
            </text>
          </svg>
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Insert Variable Button */}
        <div ref={variableButtonRef as React.RefObject<HTMLDivElement>} className="relative">
          <ToolbarButton
            onClick={() => setShowVariablePanel(!showVariablePanel)}
            isActive={showVariablePanel}
            title="Insert Variable (or type @ in editor)"
          >
            <span className="text-xs font-mono font-bold">{'{{}}'}</span>
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Variable Picker Portal */}
      {mounted && (
        <VariablePickerDropdown
          isOpen={showVariablePanel}
          onClose={() => setShowVariablePanel(false)}
          onSelect={insertVariable}
          anchorRef={variableButtonRef}
        />
      )}
    </div>
  )
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void
  isActive: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 ${
        isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  )
}
