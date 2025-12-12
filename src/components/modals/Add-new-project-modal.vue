<script lang="ts" setup>
import { reactive, ref } from 'vue'
import * as yup from 'yup'
import BaseButton from '@/components/ common/BaseButton.vue'
import { useProjectsStore } from '@/stores/project-store.ts'
import type { ProjectData } from '@/types/project.types.ts'
import { useToast } from '@/composables/useToast.ts'

interface ProjectForm {
  name: string
  description: string
}

const projects = ref<ProjectData[]>([])
const projectsStore = useProjectsStore()
const toast = useToast()

projects.value = projectsStore.projects
const isOpen = ref(false)

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
  resetForm()
}

const values = reactive<ProjectForm>({
  name: '',
  description: '',
})

const errors = reactive<Record<keyof ProjectForm, string>>({
  name: '',
  description: '',
})

const schema = yup.object().shape({
  name: yup.string().required('Название обязательно'),
  description: yup.string().required('Описание обязательно'),
})

async function handleSubmit(fn: (data: ProjectForm) => void) {
  try {
    const validated = await schema.validate(values, { abortEarly: false })
    clearErrors()
    fn(validated)
  } catch (err: any) {
    clearErrors()
    if (err.inner) {
      err.inner.forEach((e: yup.ValidationError) => {
        const key = e.path as keyof ProjectForm
        if (key) errors[key] = e.message
      })
    }
  }
}

function clearErrors() {
  ;(Object.keys(errors) as (keyof ProjectForm)[]).forEach((key) => (errors[key] = ''))
}

function resetForm() {
  values.name = ''
  values.description = ''
  clearErrors()
}

async function onSubmit(data: ProjectForm) {
  try {
    await projectsStore.createProject({
      projectName: data.name,
      status: 'To do',
      createdAt: new Date(Date.now()).toISOString(),
      quantityTasks: 0,
      description: data.description,
    })

    close()
    toast.success('Created successfully')
  } catch (e) {
    toast.error('An error has occurred')
  }
}

defineExpose({ open, close })
</script>

<template>
  <teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal" @click.self="close">
        <div class="modal__content">
          <h2 class="modal__title">Create a project</h2>

          <form class="modal__form">
            <div class="modal__group">
              <label for="name" class="modal__label">Title</label>
              <input
                id="name"
                v-model="values.name"
                type="text"
                placeholder="Enter the name"
                class="modal__input"
              />
              <span class="modal__error">{{ errors.name }} </span>
            </div>

            <div class="modal__group">
              <label for="description" class="modal__label">Description</label>
              <textarea
                id="description"
                v-model="values.description"
                placeholder="Enter description"
                class="modal__input modal__input--textarea"
              ></textarea>
              <span class="modal__error">{{ errors.description }}</span>
            </div>

            <div class="modal__actions">
              <BaseButton variant="secondary" @click.prevent="close"> Cancel</BaseButton>
              <BaseButton variant="primary" @click.prevent="handleSubmit(onSubmit)">
                Create
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style lang="scss">
.modal {
  position: fixed;
  inset: 0;
  background: $background-translucent-transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  &__content {
    background: $white;
    padding: 24px;
    width: 400px;
    border-radius: 8px;
  }

  &__title {
    margin-bottom: 16px;
    font-size: 20px;
  }

  &__group {
    margin-bottom: 16px;
    width: 100%;
  }

  &__label {
    margin-bottom: 4px;
  }

  &__input {
    padding: 8px;
    border: 1px solid $border-color;
    border-radius: 4px;
    width: 95%;

    &--textarea {
      resize: vertical;
      min-height: 80px;
    }
  }

  &__error {
    margin-top: 4px;
    font-size: 12px;
    color: $danger;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  &__button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &--primary {
      background-color: $primary;
      color: $white;
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
  transform: translateY(0);

  .modal__content {
    transform: translateY(0);
    transition:
      opacity 0.3s,
      transform 0.3s;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal__content {
    transform: translateY(-100px);
  }
}
</style>
