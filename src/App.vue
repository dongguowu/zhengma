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
          <input type="button" class="but" @click="copyInput" value="复制" />
          <input type="button" class="but" @click="clearInput" value="清空" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Ref, ref, defineComponent, onMounted } from 'vue'
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
    const clearInput = () => {
      ;(input as Ref<string>).value = ''
      ;(inputRef as Ref<HTMLElement>).value.focus()
    }

    return {
      inputRef,
      input,
      comp,
      cand,
      inputFocus,
      zhengmaKeydown,
      copyInput,
      clearInput,
    }
  },
})
</script>

<style></style>
