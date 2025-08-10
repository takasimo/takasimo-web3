<template>
  <Teleport to="body">
    <div class="toast-container" :class="position">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="[`toast--${toast.type}`, `toast--${toast.position}`]"
        >
          <div class="toast__icon">
            <v-icon v-if="toast.type === 'success'" color="success">mdi-check-circle</v-icon>
            <v-icon v-else-if="toast.type === 'error'" color="error">mdi-alert-circle</v-icon>
            <v-icon v-else-if="toast.type === 'warning'" color="warning">mdi-alert</v-icon>
            <v-icon v-else color="info">mdi-information</v-icon>
          </div>
          <div class="toast__message">{{ toast.message }}</div>
          <button class="toast__close" @click="removeToast(toast.id)">
            <v-icon size="small">mdi-close</v-icon>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

// Position prop for different toast positions
interface Props {
  position?: 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-right'
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

.toast-container.top-right {
  top: 20px;
  right: 20px;
}

.toast-container.top-left {
  top: 20px;
  left: 20px;
}

.toast-container.bottom-right {
  bottom: 20px;
  right: 20px;
}

.toast-container.bottom-left {
  bottom: 20px;
  left: 20px;
}

.toast-container.top {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-container.bottom {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
}

.toast--success {
  border-left-color: #4caf50;
}

.toast--error {
  border-left-color: #f44336;
}

.toast--warning {
  border-left-color: #ff9800;
}

.toast--info {
  border-left-color: #2196f3;
}

.toast__icon {
  flex-shrink: 0;
}

.toast__message {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.toast__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #666;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast__close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .toast-container.top-right,
  .toast-container.top-left,
  .toast-container.bottom-right,
  .toast-container.bottom-left {
    left: 20px;
    right: 20px;
    transform: none;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>
