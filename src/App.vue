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
            :onkeydown="imeKeyPress"
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
import { defineComponent, ref, onMounted } from 'vue';
import CodeList from './CodeList';

export default defineComponent({
  name: 'App',
  setup() {
    const MAX = CodeList.length;

    const input = ref(null);
    const inputContent = ref('');
    const comp = ref('');
    const cand = ref('');

    let LastNo = 0;
    const SPACECHAR = ' ';
    const CandChinesePart: string[] = [];
    const CandCompPart: string[] = [];

    const FindIn = (d: string): number => {
      let f = -1;
      let a = 0;
      let c = 0;
      let e = CodeList.length;
      let b = '';
      while (a < e) {
        c = (a + e) / 2;
        c = Math.floor(c);
        b = CodeList[c];
        if (b.indexOf(d, 0) === 0) {
          f = c;
          break;
        }
        b = CodeList[c - 1];
        if (b.indexOf(d, 0) === 0) {
          f = c;
          break;
        }
        if (b < d) {
          a = c + 1;
        } else {
          e = c - 1;
        }
      }
      while (f > 0) {
        b = CodeList[f - 1];
        if (b.indexOf(d, 0) === 0) {
          f -= 1;
        } else {
          break;
        }
      }
      return f;
    };

    const GetStr = (a: number, c: string): void => {
      let e = '';
      let d = '';
      let b;
      for (b = 0; b <= 9; b += 1) {
        if (a + b > CodeList.length - 1) {
          break;
        }
        e = CodeList[a + b];
        if (e.indexOf(c) === 0) {
          d = CodeList[a + b];
          CandCompPart[b] = d.substring(c.length, d.indexOf(SPACECHAR));
          CandChinesePart[b] = d.substr(d.lastIndexOf(SPACECHAR) + 1);
          if (b <= 8) {
            cand.value += `${b + 1}.${CandChinesePart[b]}${CandCompPart[b]}\n`;
          } else {
            cand.value += `${0}.${CandChinesePart[b]}${CandCompPart[b]}\n`;
          }
        } else {
          break;
        }
      }
      if (a > 10 && CodeList[a - 10].indexOf(c) === 0) {
        cand.value += '-.\u2190\n';
      }
      if (b === 10 && a <= CodeList.length - 11 && CodeList[a + b].indexOf(c) === 0) {
        cand.value += '+.\u2192';
      }
      LastNo = a;
    };

    function SendStr(c: string) {
      if (c.length <= 0) {
        return;
      }
      inputContent.value += c;
    }

    function SendCand(a: number) {
      if (a >= 0 && a <= 9) {
        SendStr(CandChinesePart[a]);
        comp.value = '';
        cand.value = '';
      }
    }

    function Grep(targetStr: string): void {
      let index = -1;
      for (let i = 0; i <= 9; i += 1) {
        CandChinesePart[i] = '';
      }
      if (targetStr !== '') {
        index = FindIn(targetStr);
        if (index >= 0) {
          GetStr(index, targetStr);
        }
      }
      if (CandChinesePart[0] !== '' && CandChinesePart[1] === '' && CandCompPart[0] === '') {
        SendCand(0);
      }
    }

    const imeKeyPress = (b: KeyboardEvent): boolean => {
      console.log('keypress', b.key.charCodeAt(0));
      const a = b.key.charCodeAt(0);

      // a === 66 back
      if (a === 66) {
        if (comp.value.length <= 0) {
          return false;
        }
        const s = comp.value.slice(0, -1);
        comp.value = s;
        cand.value = '';
        Grep(s);
        return true;
      }
      // 1 === 32 space
      if (a === 32) {
        comp.value = '';
        cand.value = '';
        SendStr(CandChinesePart[0]);
        return false;
      }

      if (a >= 97 && a <= 122) {
        const s = comp.value;
        if (s.length <= 3) {
          comp.value += b.key;
          cand.value = '';
          Grep(comp.value);
        } else {
          comp.value = '';
        }
        return false;
      }

      return true;
    };

    const inputFocus = () => {
      const element = input.value as HTMLElement | null;
      if (element !== null) element.focus();
    };

    onMounted(() => {
      inputFocus();
    });
    return {
      input,
      inputContent,
      inputFocus,
      comp,
      cand,
      // imeKeyDown,
      imeKeyPress
      // imeKeyUp
    };
  }
});
</script>

<style></style>
