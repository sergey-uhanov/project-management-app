<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import * as yup from 'yup'
import type { TaskFormData } from '@/types/task.types.ts'
import BaseButton from '@/components/ common/BaseButton.vue'
import CustomSelect from '@/components/ common/CustomSelect.vue'
import { useTasksStore } from '@/stores/tasks-store.ts'
import { useToast } from '@/composables/useToast.ts'

const emit = defineEmits<{
  (e: 'close'): void
}>()
const props = defineProps<{
  projectId: string
}>()

const form = ref<TaskFormData>({
  taskName: '',
  performer: '',
  status: 'To do',
  deadline: '',
  projectId: props.projectId,
})
const errors = ref<Record<string, string>>({})
const isFormValid = ref(false)
const trySubmit = ref(false)
const tasksStore = useTasksStore()
const toast = useToast()
const schema = yup.object({
  taskName: yup.string().required('Title is required'),
  performer: yup.string().required('Performer is required'),
  status: yup.string().required('Status is required'),
  deadline: yup
    .string()
    .required('Date is required')
    .test('minDate', 'The date cannot be in the past.', (value) => {
      if (!value) return false
      return value >= minDate.value!
    }),
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

watch(
  form,
  () => {
    if (trySubmit.value) {
      validateForm()
    }
  },
  { deep: true },
)

async function validateForm() {
  try {
    await schema.validate(form.value, { abortEarly: false })
    errors.value = {}
    isFormValid.value = true
  } catch (err: any) {
    isFormValid.value = false
    const errObj: Record<string, string> = {}
    err.inner.forEach((e: any) => {
      errObj[e.path] = e.message
    })
    errors.value = errObj
  }
}

function handleSubmit() {
  validateForm()

  trySubmit.value = true
  if (!isFormValid.value) return
  try {
    tasksStore.createTask(form.value)

    emit('close')
    toast.success('Created successfully')

  } catch (err) {
    toast.error( 'An error has occurred')
  }

  trySubmit.value = false
}
</script>

<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal__container">
      <div class="modal__header">
        <h2 class="modal__title">Добавить задачу</h2>
        <button class="modal__close" @click="$emit('close')">×</button>
      </div>

      <form class="form" @submit.prevent="handleSubmit">
        <!-- Task Name -->
        <div class="form__group">
          <label class="form__label" for="taskName">Task title *</label>
          <input
            id="taskName"
            v-model="form.taskName"
            type="text"
            class="form__input"
            placeholder="Enter task title"
          />
          <p v-if="errors.taskName" class="form__error">{{ errors.taskName }}</p>
        </div>

        <div class="form__group">
          <label class="form__label" for="assignee">Performer *</label>
          <custom-select
            v-model="form.performer!"
            placeholder="Performer"
            :full-width="true"
            :options="[
              { label: 'Jon Dou', value: 'Jon Dou' },
              { label: 'Sebastián Pereiro', value: 'Sebastián Pereiro' },
              { label: 'Cleveland Smith', value: 'Cleveland Smith' },
              { label: 'Peter Griffin', value: 'Peter Griffin' },
            ]"
          />
          <p v-if="errors.performer" class="form__error">{{ errors.performer }}</p>
        </div>

        <div class="form__group">
          <label class="form__label" for="status">Status *</label>
          <custom-select
            v-model="form.status!"
            placeholder="Status"
            :full-width="true"
            :options="[
              { label: 'To do', value: 'To do' },
              { label: 'In progress', value: 'In progress' },
              { label: 'Done', value: 'Done' },
            ]"
          />
          <p v-if="errors.status" class="form__error">{{ errors.status }}</p>
        </div>

        <div class="form__group">
          <label class="form__label" for="dueDate">Deadline  *</label>
          <input
            id="dueDate"
            v-model="form.deadline"
            type="date"
            :min="minDate"
            class="form__input"
          />
          <p v-if="errors.deadline" class="form__error">{{ errors.deadline }}</p>
        </div>

        <div class="form__actions">
          <BaseButton variant="secondary" @click="$emit('close')">close</BaseButton>
          <BaseButton variant="primary" @click="handleSubmit"> Submit</BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  inset: 0;
  background: $background-translucent-transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &__container {
    background: $white;
    max-width: 500px;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px $background-secondary;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid $border-color;
  }

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  &__close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    transition: 0.2s;

    &:hover {
      color: $black;
    }
  }
}

.form {
  padding: 24px;

  &__group {
    margin-bottom: 20px;
    width: 100%;
    max-width: 425px;
  }

  &__label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
  }

  &__input {
    width: 100%;
    max-width: 400px;
    padding: 10px 12px;
    border: 1px solid $border-color;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
      border-color: $primary;
      outline: none;
      box-shadow: 0 0 0 3px $dark-blue;
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
    gap: 12px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid $border-color;
  }
}
</style>
