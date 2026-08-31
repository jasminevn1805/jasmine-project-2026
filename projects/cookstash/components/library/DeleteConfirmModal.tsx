'use client'

import { useRouter } from 'next/navigation'
import { useRecipeStore } from '@/store/useRecipeStore'
import { Button, Modal } from '@jasmine/design-system'

interface DeleteConfirmModalProps {
  recipeId: string
  recipeTitle: string
  onClose: () => void
  onCancel?: () => void
}

export function DeleteConfirmModal({ recipeId, recipeTitle, onClose, onCancel }: DeleteConfirmModalProps) {
  const removeRecipe = useRecipeStore((s) => s.removeRecipe)
  const router = useRouter()

  function handleDelete() {
    removeRecipe(recipeId)
    router.push('/library')
  }

  const handleCancel = onCancel ?? onClose

  return (
    <Modal
      open
      onClose={handleCancel}
      title="Delete recipe"
      size="S"
      footer={
        <>
          <Button
            onClick={handleCancel}
            type="Outline"
            size="M"
            className="flex-1"
          >
            Cancel
          </Button>
          <button
            onClick={handleDelete}
            className="flex-1"
            style={{
              padding: 'var(--space-m)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--color-background-negative)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
              fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </>
      }
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--typography-desktop-text-m-regular-size)',
          fontWeight: 'var(--typography-desktop-text-m-regular-weight)',
          lineHeight: 'var(--typography-desktop-text-m-regular-line-height)',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}
      >
        Are you sure you want to delete <strong style={{ color: 'var(--color-text-primary)' }}>{recipeTitle}</strong>?
        This action cannot be undone.
      </p>
    </Modal>
  )
}
