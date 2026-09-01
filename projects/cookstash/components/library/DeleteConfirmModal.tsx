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
      variant="form"
      size="S"
      footer={
        <>
          <Button
            onClick={handleCancel}
            type="Outline"
            size="M"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            type="Negative Primary"
            size="M"
          >
            Delete
          </Button>
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
