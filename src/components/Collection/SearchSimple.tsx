import { createSignal, For, type Component } from 'solid-js'
import { navigate } from 'vike-lite/client/router'

import IconSearch from '@/components/Icons/IconSearch'

const TYPE_MAP = {
  'O': 'ObjectId',
  'U': 'UUID',
  'N': 'Number',
  'S': 'String',
  'B': 'Boolean',
  'R': 'Regex',
  'J': 'JSON'
}

export type TypeMap = typeof TYPE_MAP

const SearchSimple: Component<{
  data: DataCollection
}> = (props) => {
  let buttonRef: HTMLButtonElement | undefined
  const [inputKey, setInputKey] = createSignal(props.data.queryParameters.key || '')
  const [inputValue, setInputValue] = createSignal(props.data.queryParameters.value || '')
  const [selectedType, setSelectedType] = createSignal<TypeMapKeys>(props.data.queryParameters.type ?? 'O')

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
        value={selectedType()}
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            buttonRef!.click()
          }
        }}
        onChange={(event) => setSelectedType(event.currentTarget.value as TypeMapKeys)}
      >
        <For each={Object.keys(TYPE_MAP) as TypeMapKeys[]}>
          {(value) => <option value={value} selected={value === selectedType()}>{TYPE_MAP[value]}</option>}
        </For>
      </select>

      <button
        class="btn bg-blue-500"
        disabled={!inputKey() || !inputValue()}
        ref={buttonRef}
        onClick={async () => {
          await navigate(`/db/${props.data.selectedDatabase}/${props.data.selectedCollection}?key=${encodeURIComponent(inputKey())}&value=${encodeURIComponent(inputValue())}&type=${selectedType()}`)
        }}
      >
        <IconSearch />

        Find
      </button>
    </div>
  )
}

export default SearchSimple
