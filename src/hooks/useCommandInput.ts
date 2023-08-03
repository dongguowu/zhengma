export default function (
  input: string,
  isEnglishModel: boolean
): Record<string, any> {
  const copyInput = () => {
    const el = document.createElement('textarea')
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-99999px'
    el.value = input
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
  }
  const deleteInput = (): string => ''
  const googleInput = () => {
    window.open(`https://www.google.com/search?q=${input}`, '_blank')
  }
  const changeInputMode = () => !isEnglishModel

  return {
    copyInput,
    deleteInput,
    googleInput,
    changeInputMode,
  }
}
