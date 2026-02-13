'use client'

import {useEditor, EditorContent, ReactRenderer} from '@tiptap/react'
import {BubbleMenu} from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import {Extension} from '@tiptap/core'
import Suggestion, {SuggestionProps, SuggestionKeyDownProps} from '@tiptap/suggestion'
import {useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import {createPortal} from 'react-dom'
import tippy, {Instance as TippyInstance} from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import {
  ArrowTopRightOnSquareIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  PencilSquareIcon,
  TrashIcon,
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
      {key: 'assistantFirstName', label: 'Assistant First Name'},
      {key: 'assistantLastName', label: 'Assistant Last Name'},
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
  {
    category: 'CTA Buttons',
    variables: [
      {key: 'editLink', label: 'Edit Registration Button', ctaText: 'Edit Your Registration'},
      {key: 'activitiesLink', label: 'Edit Activities Button', ctaText: 'Update Your Activities'},
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
  ctaText?: string
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
                  {item.ctaText !== undefined
                    ? 'button'
                    : item.linkText
                      ? 'clickable link'
                      : `{{${item.key}}}`}
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
          editor.chain().focus().deleteRange(range).run()
          insertVariableContent(editor, props)
        },
      }),
    ]
  },
})

// Shared helper for inserting variable content into the editor
function insertVariableContent(editor: any, variable: VariableItem) {
  if (variable.ctaText !== undefined) {
    const ctaLabel = variable.ctaText || 'Click Here'
    const ctaUrl = variable.key === '__custom' ? '#' : `{{${variable.key}}}`
    editor.commands.insertContent(`<a data-cta="true" href="${ctaUrl}">${ctaLabel}</a>`)
  } else if (variable.linkText) {
    editor.commands.insertContent(`<a href="{{${variable.key}}}">${variable.linkText}</a>`)
  } else {
    editor.commands.insertContent(`{{${variable.key}}}`)
  }
}

// Insert a CTA button directly with given text and URL
function insertCtaButton(editor: any, text: string, url: string) {
  editor.chain().focus().run()
  editor.commands.insertContent(`<a data-cta="true" href="${url}">${text}</a>`)
}

// Extend Link to preserve the data-cta attribute through parse/serialize
const CtaLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-cta': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-cta'),
        renderHTML: (attributes) => {
          if (!attributes['data-cta']) return {}
          return {
            'data-cta': attributes['data-cta'],
            class: 'cta-button',
          }
        },
      },
    }
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
                key={`${cat.category}-${variable.key}`}
                className="w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-blue-50 text-gray-700"
                onClick={() => {
                  onSelect({...variable, category: cat.category})
                  onClose()
                }}
              >
                <span className="flex items-center gap-1.5">
                  {('linkText' in variable && variable.linkText) && (
                    <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  {variable.label}
                </span>
                <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {'ctaText' in variable && variable.ctaText !== undefined
                    ? 'button'
                    : 'linkText' in variable && variable.linkText
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

function LinkBubble({editor}: {editor: any}) {
  const [editing, setEditing] = useState(false)
  const href = editor.getAttributes('link').href || ''
  const isCta = editor.getAttributes('link')['data-cta'] === 'true'
  const [url, setUrl] = useState(href)

  useEffect(() => {
    setUrl(href)
    setEditing(false)
  }, [href])

  if (editing) {
    return (
      <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1.5 gap-1.5">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && url.trim()) {
              editor.chain().focus().extendMarkRange('link').setLink({href: url.trim()}).run()
              setEditing(false)
            }
            if (e.key === 'Escape') setEditing(false)
          }}
          className="text-sm px-2 py-1 border border-gray-300 rounded w-[220px] focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={() => {
            if (url.trim()) {
              editor.chain().focus().extendMarkRange('link').setLink({href: url.trim()}).run()
              setEditing(false)
            }
          }}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
          title="Save"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-lg px-2.5 py-1.5 gap-1">
      {isCta && (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-white bg-pink-400 rounded px-1.5 py-0.5 mr-1">CTA</span>
      )}
      <span className="text-sm text-gray-600 max-w-[200px] truncate">{href}</span>
      <button
        onClick={() => setEditing(true)}
        className="p-1 rounded hover:bg-gray-100 text-gray-500"
        title="Edit URL"
      >
        <PencilSquareIcon className="w-3.5 h-3.5" />
      </button>
      {!href.startsWith('{{') && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded hover:bg-gray-100 text-gray-500"
          title="Open link"
        >
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
        </a>
      )}
      <button
        onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
        className="p-1 rounded hover:bg-gray-100 text-red-400"
        title="Remove link"
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function LinkPopover({
  onSubmit,
  onClose,
  anchorRef,
}: {
  onSubmit: (url: string) => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [position, setPosition] = useState({top: 0, left: 0})
  const [url, setUrl] = useState('https://')

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosition({top: rect.bottom + 4, left: rect.left})
    }
  }, [anchorRef])

  return (
    <div
      className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl w-[300px]"
      style={{top: position.top, left: position.left}}
    >
      <div className="p-3 space-y-2">
        <input
          type="text"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit(url.trim())
            if (e.key === 'Escape') onClose()
          }}
          className="w-full text-sm px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
        <button
          onClick={() => onSubmit(url.trim())}
          disabled={!url.trim()}
          className="w-full text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add Link
        </button>
      </div>
    </div>
  )
}

function CtaPopover({
  onInsert,
  onClose,
  anchorRef,
}: {
  onInsert: (text: string, url: string) => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [position, setPosition] = useState({top: 0, left: 0})
  const [ctaText, setCtaText] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosition({top: rect.bottom + 4, left: rect.left})
    }
  }, [anchorRef])

  const handleInsert = () => {
    if (!ctaText.trim() || !ctaUrl.trim()) return
    onInsert(ctaText.trim(), ctaUrl.trim())
  }

  const handlePreset = (text: string, url: string) => {
    onInsert(text, url)
  }

  return (
    <div
      className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl w-[320px]"
      style={{top: position.top, left: position.left}}
    >
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 rounded-t-lg border-b border-gray-100">
        Insert CTA Button
      </div>
      <div className="p-3 space-y-3">
        <div className="flex gap-2">
          <button
            className="flex-1 text-xs px-3 py-1.5 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-gray-700"
            onClick={() => handlePreset('Edit Your Registration', '{{editLink}}')}
          >
            Edit Registration
          </button>
          <button
            className="flex-1 text-xs px-3 py-1.5 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-gray-700"
            onClick={() => handlePreset('Update Your Activities', '{{activitiesLink}}')}
          >
            Edit Activities
          </button>
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <input
            type="text"
            placeholder="Button text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="w-full text-sm px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <input
            type="text"
            placeholder="URL or {{editLink}}"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
            className="w-full text-sm px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleInsert}
            disabled={!ctaText.trim() || !ctaUrl.trim()}
            className="w-full text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Insert Button
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RichTextEditor({content, onChange}: RichTextEditorProps) {
  const [showVariablePanel, setShowVariablePanel] = useState(false)
  const [showCtaPanel, setShowCtaPanel] = useState(false)
  const [showLinkPanel, setShowLinkPanel] = useState(false)
  const [mounted, setMounted] = useState(false)
  const variableButtonRef = useState<React.RefObject<HTMLDivElement | null>>(() => ({
    current: null,
  }))[0]
  const ctaButtonRef = useState<React.RefObject<HTMLDivElement | null>>(() => ({
    current: null,
  }))[0]
  const linkButtonRef = useState<React.RefObject<HTMLDivElement | null>>(() => ({
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
      CtaLink.configure({
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

  const insertVariable = (variable: VariableItem) => {
    if (!editor) return
    editor.chain().focus().run()
    insertVariableContent(editor, variable)
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-md min-h-[250px] bg-gray-50 animate-pulse" />
    )
  }

  return (
    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {/* CTA button styling in editor */}
      <style>{`
        .ProseMirror a.cta-button {
          display: inline-block;
          background: #f49898;
          color: #1c2544 !important;
          padding: 6px 16px;
          border-radius: 6px;
          font-weight: 600;
          text-decoration: none !important;
          cursor: pointer;
        }
      `}</style>
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

        <div ref={linkButtonRef as React.RefObject<HTMLDivElement>} className="relative">
          <ToolbarButton
            onClick={() => setShowLinkPanel(!showLinkPanel)}
            isActive={showLinkPanel || editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* CTA Button */}
        <div ref={ctaButtonRef as React.RefObject<HTMLDivElement>} className="relative">
          <ToolbarButton
            onClick={() => setShowCtaPanel(!showCtaPanel)}
            isActive={showCtaPanel}
            title="Insert CTA Button"
          >
            <span className="text-xs font-bold">CTA</span>
          </ToolbarButton>
        </div>

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

      {/* Bubble menu for existing links/CTAs */}
      <BubbleMenu
        editor={editor}
        shouldShow={({editor}) => editor.isActive('link')}
        tippyOptions={{placement: 'bottom-start', maxWidth: 'none'}}
      >
        <LinkBubble editor={editor} />
      </BubbleMenu>

      {/* Variable Picker Portal */}
      {mounted && (
        <VariablePickerDropdown
          isOpen={showVariablePanel}
          onClose={() => setShowVariablePanel(false)}
          onSelect={insertVariable}
          anchorRef={variableButtonRef}
        />
      )}

      {/* Link Popover Portal (for adding new links from toolbar) */}
      {mounted && showLinkPanel && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setShowLinkPanel(false)} />
          <LinkPopover
            onSubmit={(url) => {
              if (url) {
                editor.chain().focus().extendMarkRange('link').setLink({href: url}).run()
              }
              setShowLinkPanel(false)
            }}
            onClose={() => setShowLinkPanel(false)}
            anchorRef={linkButtonRef}
          />
        </>,
        document.body,
      )}

      {/* CTA Picker Portal */}
      {mounted && showCtaPanel && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setShowCtaPanel(false)} />
          <CtaPopover
            onInsert={(text, url) => {
              insertCtaButton(editor, text, url)
              setShowCtaPanel(false)
            }}
            onClose={() => setShowCtaPanel(false)}
            anchorRef={ctaButtonRef}
          />
        </>,
        document.body,
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
