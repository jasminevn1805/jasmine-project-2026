'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Copy, X, Plus, ShoppingCart } from 'react-feather'
import { Button } from '@jasmine/design-system'
import { useGroceryStore } from '@/store/useGroceryStore'
import { GroceryList } from '@/components/grocery/GroceryList'
import { ShareListButton } from '@/components/grocery/ShareListButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageShell, PageHeader } from '@/components/shared/layout'
import type { GroceryList as GroceryListType } from '@/types'

export default function GroceryPage() {
  const { lists, createList, updateList, deleteList } = useGroceryStore()
  const [activeListId, setActiveListId] = useState<string | null>(
    lists[0]?.id ?? null,
  )

  // ── Inline-rename state ────────────────────────────────────
  const [namingListId, setNamingListId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // ── Drawer state ───────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const activeList = lists.find((l) => l.id === activeListId) ?? null

  useEffect(() => {
    if (namingListId) {
      requestAnimationFrame(() => nameInputRef.current?.focus())
    }
  }, [namingListId])

  // ── Callbacks ─────────────────────────────────────────────
  function handleCreateList() {
    const id = crypto.randomUUID()
    const newList: GroceryListType = {
      id,
      name: 'List Name',
      items: [],
      linkedPlanId: null,
      createdAt: new Date().toISOString(),
      shareToken: null,
    }
    createList(newList)
    setActiveListId(id)
    setNamingListId(id)
    setDraftName('')
    setIsCreatingNew(true)
  }

  function handleDeleteList(e: React.MouseEvent, listId: string) {
    e.stopPropagation()
    if (namingListId === listId) {
      setNamingListId(null)
      setDraftName('')
      setIsCreatingNew(false)
    }
    deleteList(listId)
    if (activeListId === listId) {
      const remaining = lists.filter((l) => l.id !== listId)
      setActiveListId(remaining[0]?.id ?? null)
    }
  }

  function handleDuplicateList(e: React.MouseEvent, listId: string) {
    e.stopPropagation()
    const source = lists.find((l) => l.id === listId)
    if (!source) return
    const id = crypto.randomUUID()
    const copy: GroceryListType = {
      ...source,
      id,
      name: `${source.name} (copy)`,
      items: source.items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      })),
      createdAt: new Date().toISOString(),
      shareToken: null,
    }
    createList(copy)
    setActiveListId(id)
    setNamingListId(id)
    setDraftName(copy.name)
    setIsCreatingNew(false)
  }

  function handleStartRename(
    e: React.MouseEvent,
    listId: string,
    currentName: string,
  ) {
    e.stopPropagation()
    setActiveListId(listId)
    setNamingListId(listId)
    setDraftName(currentName)
  }

  function handleCommitRename() {
    if (!namingListId) return
    const trimmed = draftName.trim()
    const existing =
      lists.find((l) => l.id === namingListId)?.name ?? 'List Name'
    updateList(namingListId, { name: trimmed || existing })
    setNamingListId(null)
    setDraftName('')
    setIsCreatingNew(false)
  }

  const checkedCount = activeList?.items.filter((i) => i.checked).length ?? 0
  const totalCount = activeList?.items.length ?? 0
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

  return (
    <PageShell>
      <PageHeader
        title="Grocery List"
        subtitle="Build and check off your shopping list"
      >
        {/* ── List selector tab bar ───────────────────────────── */}
        <div
          className="hide-scrollbar"
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: 'var(--space-s)',
            paddingBottom: 'var(--space-xs)',
          }}
        >
          {lists.map((l) => {
            const isActive = activeListId === l.id
            const isNaming = namingListId === l.id

            return (
              <div
                key={l.id}
                onClick={() => !isNaming && setActiveListId(l.id)}
                className="text-body-strong"
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-m)',
                  borderRadius: 'var(--radius-pill)',
                  paddingInline: !isNaming
                    ? 'var(--space-l) var(--space-m)'
                    : 'var(--space-l)',
                  paddingBlock: 'var(--space-s)',
                  background: isActive
                    ? 'var(--color-background-inverse)'
                    : 'var(--color-background-secondary)',
                  color: isActive
                    ? 'var(--color-text-primary-inverse)'
                    : 'var(--color-text-secondary)',
                  transition:
                    'background var(--motion-duration-base) var(--motion-easing-out), color var(--motion-duration-base) var(--motion-easing-out)',
                  cursor: isNaming ? 'default' : 'pointer',
                  userSelect: 'none',
                }}
              >
                {isNaming ? (
                  <input
                    ref={nameInputRef}
                    value={draftName}
                    placeholder="List Name"
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommitRename()
                      if (e.key === 'Escape') handleCommitRename()
                    }}
                    onBlur={handleCommitRename}
                    onClick={(e) => e.stopPropagation()}
                    className="text-body-strong"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--color-text-primary-inverse)',
                      width: '96px',
                      caretColor: 'var(--color-text-primary-inverse)',
                    }}
                  />
                ) : (
                  <span
                    onDoubleClick={(e) => handleStartRename(e, l.id, l.name)}
                    title="Double-click to rename"
                  >
                    {l.name}
                  </span>
                )}
                {!isNaming && (
                  <>
                    <button
                      onClick={(e) => handleDuplicateList(e, l.id)}
                      title="Duplicate list"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        background: 'transparent',
                        color: isActive
                          ? 'var(--color-text-primary-inverse)'
                          : 'var(--color-text-tertiary)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition:
                          'background var(--motion-duration-fast) var(--motion-easing-out), opacity var(--motion-duration-fast) var(--motion-easing-out)',
                        opacity: 0.7,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.7'
                      }}
                    >
                      <Copy size={11} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteList(e, l.id)}
                      title="Delete list"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        background: 'transparent',
                        color: isActive
                          ? 'var(--color-text-primary-inverse)'
                          : 'var(--color-text-tertiary)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition:
                          'background var(--motion-duration-fast) var(--motion-easing-out), opacity var(--motion-duration-fast) var(--motion-easing-out)',
                        opacity: 0.7,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.7'
                      }}
                    >
                      <X size={11} />
                    </button>
                  </>
                )}
              </div>
            )
          })}

          {/* + New List tab */}
          {!isCreatingNew && (
            <button
              onClick={handleCreateList}
              className="text-body-strong"
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                borderRadius: 'var(--radius-pill)',
                paddingInline: 'var(--space-l)',
                paddingBlock: 'var(--space-s)',
                background: 'transparent',
                color: 'var(--color-text-tertiary)',
                border: '1px dashed var(--color-border-default)',
                cursor: 'pointer',
                transition:
                  'border-color var(--motion-duration-fast) var(--motion-easing-out), color var(--motion-duration-fast) var(--motion-easing-out)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-brand)'
                e.currentTarget.style.color = 'var(--color-text-brand)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-default)'
                e.currentTarget.style.color = 'var(--color-text-tertiary)'
              }}
            >
              <Plus size={12} />
              <span>New List</span>
            </button>
          )}
        </div>

        {/* ── Stats row + progress bar ───────────────────────── */}
        {activeList && (
          <div
            className="flex flex-col"
            style={{ gap: 'var(--layout-stack-tight)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-body text-secondary" style={{ margin: 0 }}>
                {checkedCount} / {totalCount} items checked
              </p>

              <div
                className="flex items-center"
                style={{ gap: 'var(--space-s)' }}
              >
                {totalCount > 0 && (
                  <Button onClick={openDrawer} type="Primary" size="S">
                    <Plus size={14} />
                    Add items
                  </Button>
                )}
                <ShareListButton list={activeList} />
              </div>
            </div>

            {totalCount > 0 && (
              <div
                style={{
                  height: '6px',
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-background-secondary)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-background-brand)',
                    transition:
                      'width var(--motion-duration-slow) var(--motion-easing-in-out)',
                    width: `${progress}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}
      </PageHeader>

      {/* ── Scrollable content area ───────────────────────────── */}
      <div
        style={{
          paddingInline: 'var(--layout-page-x)',
          paddingTop: 'var(--layout-section-y)',
          paddingBottom: 'var(--space-4xl)',
        }}
      >
        {activeList ? (
          <GroceryList
            list={activeList}
            drawerOpen={drawerOpen}
            onOpenDrawer={openDrawer}
            onCloseDrawer={closeDrawer}
          />
        ) : (
          <EmptyState
            icon={<ShoppingCart size={32} />}
            title="No grocery lists yet"
            description="Create your first list to start building your shopping trip."
            actionLabel="Create List"
            onAction={handleCreateList}
          />
        )}
      </div>
    </PageShell>
  )
}
