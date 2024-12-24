import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';

export enum MessageType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

interface SetMessageInput {
  message: string;
  timeout?: number;
}

export const useAppStore = defineStore('appStore', () => {
  const messageState = ref('');
  const messageTypeState: Ref<MessageType | undefined> = ref(undefined);
  const msgTimeout: Ref<number | undefined> = ref(undefined);

  const message = computed(() => messageState.value);
  const messageType = computed(() => messageTypeState.value);

  function setMessage(msg: string, type: MessageType, timeout: number) {
    messageState.value = msg;
    messageTypeState.value = type;
    msgTimeout.value = window.setTimeout(() => clearMessage, timeout);
  }

  function setErrorMessage(input: SetMessageInput) {
    setMessage(input.message, MessageType.Error, input.timeout ?? 50000);
  }

  function setInfoMessage(input: SetMessageInput) {
    setMessage(input.message, MessageType.Info, input.timeout ?? 5000);
  }

  function setSuccessMessage(input: SetMessageInput) {
    setMessage(input.message, MessageType.Success, input.timeout ?? 5000);
  }

  function clearMessage() {
    messageState.value = '';
    messageTypeState.value = undefined;
    clearTimeout(msgTimeout.value);
    msgTimeout.value = undefined;
  }

  return {
    message,
    messageType,
    setErrorMessage,
    setInfoMessage,
    setSuccessMessage,
    clearMessage,
  };
});
