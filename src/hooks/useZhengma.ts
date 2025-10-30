import { onMounted, ref } from 'vue'
import CodeList from '../CodeList'

export default function useZhengma(isEnglish: boolean): Record<string, unknown> {
  const textAreaRef = ref(null)
  const textAreaString = ref('')
  const currentZhengmaCodeInput = ref('')
  const currentZhengmaCandidates = ref('')

  // const isEnglish = false
  const SPACE_CHAR = ' '
  const CandidatesChinesePart: string[] = []
  const CandidateCodePart: string[] = []

  const FindIn = (d: string): number => {
    let f = -1
    let a = 0
    let c = 0
    let e = CodeList.length
    let b = ''
    while (a < e) {
      c = (a + e) / 2
      c = Math.floor(c)
      b = CodeList[c]
      if (b.indexOf(d, 0) === 0) {
        f = c
        break
      }
      b = CodeList[c - 1]
      if (b.indexOf(d, 0) === 0) {
        f = c
        break
      }
      if (b < d) {
        a = c + 1
      } else {
        e = c - 1
      }
    }
    while (f > 0) {
      b = CodeList[f - 1]
      if (b.indexOf(d, 0) === 0) {
        f -= 1
      } else {
        break
      }
    }
    return f
  }

  const GetStr = (a: number, c: string): void => {
    let e = ''
    let d = ''
    let b
    for (b = 0; b <= 9; b += 1) {
      if (a + b > CodeList.length - 1) {
        break
      }
      e = CodeList[a + b]
      if (e.indexOf(c) === 0) {
        d = CodeList[a + b]
        CandidateCodePart[b] = d.substring(c.length, d.indexOf(SPACE_CHAR))
        CandidatesChinesePart[b] = d.substr(d.lastIndexOf(SPACE_CHAR) + 1)
        if (b <= 8) {
          currentZhengmaCandidates.value += `${b + 1}.${CandidatesChinesePart[b]}${CandidateCodePart[b]}\n`
        } else {
          currentZhengmaCandidates.value += `${0}.${CandidatesChinesePart[b]}${CandidateCodePart[b]}\n`
        }
      } else {
        break
      }
    }
    if (a > 10 && CodeList[a - 10].indexOf(c) === 0) {
      currentZhengmaCandidates.value += '-.\u2190\n'
    }
    if (
      b === 10 &&
      a <= CodeList.length - 11 &&
      CodeList[a + b].indexOf(c) === 0
    ) {
      currentZhengmaCandidates.value += '+.\u2192'
    }
  }

  function SendStr(c: string) {
    if (c.length <= 0) {
      return
    }
    textAreaString.value += c
  }

  function SendCand(a: number) {
    if (a >= 0 && a <= 9) {
      SendStr(CandidatesChinesePart[a])
      currentZhengmaCodeInput.value = ''
      currentZhengmaCandidates.value = ''
    }
  }

  function Grep(targetStr: string): void {
    let index = -1
    for (let i = 0; i <= 9; i += 1) {
      CandidatesChinesePart[i] = ''
    }
    if (targetStr !== '') {
      index = FindIn(targetStr)
      if (index >= 0) {
        GetStr(index, targetStr)
      }
    }
    if (
      CandidatesChinesePart[0] !== '' &&
      CandidatesChinesePart[1] === '' &&
      CandidateCodePart[0] === ''
    ) {
      SendCand(0)
    }
  }

  const handleKeyPress = (e: KeyboardEvent): boolean => {
    // console.log('keydown: ', e.key, e.key.charCodeAt(0))
    const keyCode = e.key.charCodeAt(0)

    // FIXME: change input mode
    if (isEnglish) {
      //   if (keyCode === 69) {
      //     // console.log(input.value.slice(-3))
      //     if (input.value.slice(-3) === ':zm') {
      //       isEnglish = false
      //       input.value = input.value.slice(0, -3)
      //       comp.value = ''
      //       return false
      //     }
      //   }

      return true // starting input english words
    }

    // handle non-alpha, non-number 
    // if (currentZhengmaCodeInput.value.length === 1 && !(keyCode >= 48 && keyCode <= 57)) {
    //   // backspace
    //   return true
    // }

    // a === 66 back
    if (keyCode === 66 && currentZhengmaCodeInput.value.length >= 1) {
      const s = currentZhengmaCodeInput.value.slice(0, -1)
      currentZhengmaCodeInput.value = s
      currentZhengmaCandidates.value = ''
      Grep(s)
      return false
    }
    // 1 === 32 space
    if (keyCode === 32 && currentZhengmaCodeInput.value.length >= 1) {
      currentZhengmaCodeInput.value = ''
      currentZhengmaCandidates.value = ''
      SendStr(CandidatesChinesePart[0])
      return false
    }

    // ctrl [ : command
    // if (keyCode === 91) {
    //   e.preventDefault()
    //   console.log(e.ctrlKey)
    //   console.log("command")
    //   comp.value = ":"
    //   return false
    // }

    // handle number  '48-57'
    if (keyCode >= 48 && keyCode <= 57) {
      currentZhengmaCodeInput.value = ''
      currentZhengmaCandidates.value = ''
      // 49 - 0; 48 - 9
      const index = keyCode - 49 >= 0 ? keyCode - 49 : 9
      SendStr(CandidatesChinesePart[index])
      return false
    }

    // handle alpha '97-122'
    if (keyCode >= 97 && keyCode <= 122) {
      const currentZhengmaCode = currentZhengmaCodeInput.value
      if (currentZhengmaCode.length <= 3) {
        currentZhengmaCodeInput.value += e.key
        currentZhengmaCandidates.value = ''

        // change to english editing status
        // if (s.indexOf('abc') === 0) {
        //   isEnglish = true
        //   // comp.value = 'english input';
        //   comp.value = ':zm to return chinese'
        //   return true
        // }

        Grep(currentZhengmaCodeInput.value)
      } else {
        currentZhengmaCodeInput.value = ''
      }
      return false
    }

    return true
  }

  const inputFocus = () => {
    const element = textAreaRef.value as HTMLElement | null
    if (element !== null) element.focus()
  }

  onMounted(() => {
    inputFocus()
  })

  return {
    textAreaRef,
    textAreaString,
    currentZhengmaCodeInput,
    currentZhengmaCandidates,
    inputFocus,
    handleKeyPress,
  }
}
