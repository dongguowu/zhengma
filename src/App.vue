<template>
  <table width="100%" border="0" cellpadding="0" cellspacing="4">
    <tbody>
      <tr>
        <td rowspan="2" align="center" width="70%">
          <textarea
            ref="input"
            v-model="inputContent"
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
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useZhengma from './useZhengma'

export default defineComponent({
  name: 'App',
  setup() {
    return {
      ...useZhengma(),
    }
  },
})
</script>

<style></style>
