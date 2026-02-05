'use client'

import {useEditor, EditorContent, ReactRenderer} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import {Extension} from '@tiptap/core'
import Suggestion, {SuggestionProps, SuggestionKeyDownProps} from '@tiptap/suggestion'
import {useCallback, useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {createPortal} from 'react-dom'
import tippy, {Instance as TippyInstance} from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  LinkSlashIcon,
  ListBulletIcon,
  NumberedListIcon,
} from '@heroicons/react/24/outline'

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
      {key: 'editLink', label: 'Edit Registration Link', linkText: 'Edit your registration'},
      {key: 'activitiesLink', label: 'Edit Activities Link', linkText: 'Update your activities'},
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
  linkText?: string
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
                <span className="flex items-center gap-1.5">
                  {item.linkText && <LinkIcon className="w-3.5 h-3.5 text-blue-500" />}
                  {item.label}
                </span>
                <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {item.linkText ? 'clickable link' : `{{${item.key}}}`}
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

// Create the variable suggestion extension - using {{ as trigger to match variable syntax
const VariableSuggestion = Extension.create({
  name: 'variableSuggestion',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '{{',
        allowSpaces: false,
        findSuggestionMatch: (config) => {
          const {$position} = config
          // Get text from start of current text block to cursor
          const textBefore = $position.parent.textBetween(
            0,
            $position.parentOffset,
            undefined,
            '\ufffc',
          )

          // Find the last {{ that isn't closed
          let lastOpenIndex = -1
          let searchFrom = 0
          while (true) {
            const openIdx = textBefore.indexOf('{{', searchFrom)
            if (openIdx === -1) break
            // Check if this {{ has a matching }}
            const closeIdx = textBefore.indexOf('}}', openIdx + 2)
            if (closeIdx === -1) {
              // This {{ is unclosed - it's our trigger
              lastOpenIndex = openIdx
              break
            }
            // This {{ is closed, keep searching
            searchFrom = closeIdx + 2
          }

          if (lastOpenIndex === -1) {
            return null
          }

          // Calculate the absolute position
          const from = $position.start() + lastOpenIndex
          const to = $position.pos
          const query = textBefore.slice(lastOpenIndex + 2)

          // Don't match if query contains } (malformed)
          if (query.includes('}')) {
            return null
          }

          return {
            range: {from, to},
            query,
            text: textBefore.slice(lastOpenIndex),
          }
        },
        items: ({query}: {query: string}) => {
          const lowerQuery = query.toLowerCase()
          if (!lowerQuery) {
            // Show all variables when no query
            return ALL_VARIABLES
          }
          return ALL_VARIABLES.filter(
            (item) =>
              item.label.toLowerCase().includes(lowerQuery) ||
              item.key.toLowerCase().includes(lowerQuery),
          )
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
          // Delete the {{query and insert the variable
          if (props.linkText) {
            // For link variables, insert as a clickable link
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent(`<a href="{{${props.key}}}">${props.linkText}</a>`)
              .run()
          } else {
            editor.chain().focus().deleteRange(range).insertContent(`{{${props.key}}}`).run()
          }
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
      // getBoundingClientRect returns viewport-relative coords,
      // which is what we need for position: fixed
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
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
                <span className="flex items-center gap-1.5">
                  {'linkText' in variable && variable.linkText && (
                    <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  {variable.label}
                </span>
                <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {'linkText' in variable && variable.linkText
                    ? 'clickable link'
                    : `{{${variable.key}}}`}
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
        heading: {
          levels: [1, 2],
        },
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
        // Disable built-in list extensions so we can add them without input rules
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      // Add list extensions without input rules (so "- " doesn't auto-convert to bullet)
      BulletList.extend({
        addInputRules() {
          return []
        },
      }),
      OrderedList.extend({
        addInputRules() {
          return []
        },
      }),
      ListItem,
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
    if (variable.linkText) {
      // For link variables, insert as a clickable link
      editor
        .chain()
        .focus()
        .insertContent(`<a href="{{${variable.key}}}">${variable.linkText}</a>`)
        .run()
    } else {
      editor.chain().focus().insertContent(`{{${variable.key}}}`).run()
    }
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
          <BoldIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <ItalicIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
          isActive={editor.isActive('heading', {level: 1})}
          title="Heading 1"
        >
          <span className="text-xs font-bold">H1</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
          isActive={editor.isActive('heading', {level: 2})}
          title="Heading 2"
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        {editor.isActive('link') && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            isActive={false}
            title="Remove Link"
          >
            <LinkSlashIcon className="w-4 h-4" />
          </ToolbarButton>
        )}

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <ListBulletIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <NumberedListIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Insert Variable Button */}
        <div ref={variableButtonRef as React.RefObject<HTMLDivElement>} className="relative">
          <ToolbarButton
            onClick={() => setShowVariablePanel(!showVariablePanel)}
            isActive={showVariablePanel}
            title="Insert Variable (or type {{ in editor)"
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
