<template>
  <table width="100%" border="0" cellpadding="0" cellspacing="4">
    <tbody>
      <tr>
        <td rowspan="2" align="center" width="70%">
          <textarea
            ref="inputRef"
            v-model="input"
            class="textarea"
            style="width: 98%; height: 300px"
            :onkeydown="zhengmaKeydown"
            placeholder="请在这里打字"
          ></textarea>
        </td>

        <td align="center" width="30%">
          <input
            v-model="comp"
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
            v-model="cand"
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
import { ref, Ref, defineComponent, onMounted, onUpdated } from 'vue'
import tinykeys from 'tinykeys'
import useZhengma from './hooks/useZhengma'

export default defineComponent({
  name: 'App',
  setup() {
    // const input = ref('')
    const { inputRef, input, comp, cand, inputFocus, zhengmaKeydown } =
      useZhengma()
    const copyInput = () => {
      const el = document.createElement('textarea')
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-99999px'
      el.value = (input as Ref<string>).value
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      // ;(inputFocus as Function)()
      ;(inputRef as Ref<HTMLElement>).value.focus()
    }
    const deleteInput = () => {
      ;(input as Ref<string>).value = ''
      ;(inputRef as Ref<HTMLElement>).value.focus()
    }
    const googleInput = () => {
      window.open(
        `https://www.google.com/search?q=${(input as Ref<string>).value}`,
        '_blank'
      )
    }

    onMounted(() => {
      ;(input as Ref<string>).value = localStorage.getItem('content') || ''
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
      })
    })

    onUpdated(() => {
      localStorage.setItem('content', (input as Ref<string>).value)
    })

    const status = ref('this is status info.')

    return {
      inputRef,
      input,
      comp,
      cand,
      inputFocus,
      zhengmaKeydown,
      copyInput,
      deleteInput,
      googleInput,
      status,
    }
  },
})
</script>

<style></style>
