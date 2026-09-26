import { createSignal, For, type Component } from 'solid-js'
import { navigate } from 'vike-lite/client/router'

import IconSearch from '@/components/Icons/IconSearch'

const VALUES_TO_DISPLAY = {
  'O': 'ObjectId',
  'U': 'UUID',
  'N': 'Number',
  'S': 'String',
  'B': 'Boolean',
  'R': 'Regex',
  'J': 'JSON'
}

type SelectValue = typeof VALUES_TO_DISPLAY[keyof typeof VALUES_TO_DISPLAY]

const SearchSimple: Component<{
  data: DataCollection
}> = (props) => {
  let buttonRef: HTMLButtonElement | undefined
  const [inputKey, setInputKey] = createSignal(props.data.queryParameters.key || '')
  const [inputValue, setInputValue] = createSignal(props.data.queryParameters.value || '')
  const [selectValue, setSelectValue] = createSignal<SelectValue>(props.data.queryParameters.type ? VALUES_TO_DISPLAY[props.data.queryParameters.type as keyof typeof VALUES_TO_DISPLAY] : 'ObjectId')

  return (
    <div class="flex flex-row gap-2">
      <input
        // TODO add validation for key
        type="text"
        placeholder="Key"
        class="input"
        value={inputKey()}
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            buttonRef!.click()
          } else {
            setInputKey(event.currentTarget.value.trim())
          }
        }}
      />

      <input
        type="text"
        placeholder="Value"
        class="input"
        value={inputValue()}
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            buttonRef!.click()
          } else {
            setInputValue(event.currentTarget.value.trim())
          }
        }}
      />

      <select
        class="list select"
        value={selectValue()}
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            buttonRef!.click()
          }
        }}
        onChange={(event) => setSelectValue(event.currentTarget.value as SelectValue)}
      >
        <For each={Object.values(VALUES_TO_DISPLAY)}>
          {(value) => <option value={value} selected={value === selectValue()}>{value}</option>}
        </For>
      </select>

      <button
        class="btn bg-blue-500"
        disabled={!inputKey() || !inputValue()}
        ref={buttonRef}
        onClick={async () => {
          await navigate(`/db/${props.data.selectedDatabase}/${props.data.selectedCollection}?key=${encodeURIComponent(inputKey())}&value=${encodeURIComponent(inputValue())}&type=${Object.keys(VALUES_TO_DISPLAY).find(key => VALUES_TO_DISPLAY[key as keyof typeof VALUES_TO_DISPLAY] === selectValue())}`)
        }}
      >
        <IconSearch />

        Find
      </button>
    </div>
  )
}

export default SearchSimple
