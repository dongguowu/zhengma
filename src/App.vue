<template>
  <table width="100%" border="0" cellpadding="0" cellspacing="4">
    <tbody>
      <tr>
        <td rowspan="2" align="center" width="70%">
          <textarea
            ref="textAreaRef"
            v-model="textAreaString"
            class="textarea"
            style="width: 98%; height: 300px"
            :onkeydown="zhengmaKeydown"
            placeholder="请在这里开始输入中文"
          ></textarea>
        </td>

        <td align="center" width="30%">
          <input
            v-model="currentZhengmaCode"
            :onfocus="inputFocus"
            class="textarea"
            style="width: 96%"
            type="text"
          />
        </td>
      </tr>
      <tr>
        <td align="center">
          <textarea
            v-model="currentZhengmaCandidates"
            :onfocus="inputFocus"
            class="textarea"
            style="width: 96%; height: 272px"
          ></textarea>
        </td>
      </tr>
      <tr>
        <td colspan="2" height="30" align="center">
          <input
            type="button"
            class="but"
            @click="googleInput"
            value="Google"
          />
          <input type="button" class="but" @click="copyInput" value="Copy" />
          <input
            type="button"
            class="but"
            @click="deleteInput"
            value="Delete"
          />
          <input
            type="button"
            class="but"
            @click="isEnglishMode = !isEnglishMode"
            v-bind:value="isEnglishMode ? 'English' : 'Chinese'"
          />
        </td>
      </tr>
      <tr>
        <td>
          {{ status }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import {
  ref,
  Ref,
  defineComponent,
  onMounted,
  onUpdated,
  watchEffect,
} from 'vue'
import tinykeys from 'tinykeys'
import useZhengma from './hooks/useZhengma'

export default defineComponent({
  name: 'App',
  setup() {
    const status = ref('')
    const isEnglishMode = ref(false)

    const getFormattedDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `updated: ${year}-${month}-${day} / ${hours}:${minutes}${ampm}`;
    };

    watchEffect(() => {
      const mode = isEnglishMode.value ? 'English' : 'Chinese';
      // status.value = getFormattedDateTime() + ` / mode: ${mode}`;
      status.value =  `${getFormattedDateTime()} / mode: ${mode}`;
    })

    const {
      textAreaRef,
      textAreaString,
      currentZhengmaCode,
      currentZhengmaCandidates,
      inputFocus,
      handleKeyPress,
    } =
      useZhengma(isEnglishMode.value)

    const copyInput = () => {
      const el = document.createElement('textarea')
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-99999px'
      el.value = (textAreaString as Ref<string>).value
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      // ;(inputFocus as Function)()
      ;(textAreaRef as Ref<HTMLElement>).value.focus()
    }
    const deleteInput = () => {
      ;(textAreaString as Ref<string>).value = ''
      ;(textAreaRef as Ref<HTMLElement>).value.focus()
    }
    const googleInput = () => {
      window.open(
        `https://www.google.com/search?q=${(textAreaString as Ref<string>).value}`,
        '_blank'
      )
    }

    onMounted(() => {
      ;(textAreaString as Ref<string>).value = localStorage.getItem('content') || ''
      tinykeys(window, {
        '$mod+KeyD': (event) => {
          event.preventDefault()
          deleteInput()
        },
        '$mod+KeyG': (event) => {
          event.preventDefault()
          googleInput()
        },
        '$mod+KeyC': (event) => {
          event.preventDefault()
          copyInput()
        },
        '$mod+KeySpace': (event) => {
          event.preventDefault()
          isEnglishMode.value = !isEnglishMode.value
        },
      })
    })

    onUpdated(() => {
      localStorage.setItem('content', (textAreaString as Ref<string>).value)
    })

    return {
      textAreaRef,
      textAreaString,
      currentZhengmaCode,
      currentZhengmaCandidates,
      handleKeyPress,
      inputFocus,
      copyInput,
      deleteInput,
      googleInput,
      status,
      isEnglishMode,
    }
  },
})
</script>

<style></style>
