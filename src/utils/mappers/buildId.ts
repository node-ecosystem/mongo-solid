import { Binary, ObjectId } from 'bson'

export default function buildId(_id: string | number, sub_type: number | undefined) {
  // Case 1 : ObjectId
  try {
    return ObjectId.createFromHexString(_id as string)
  } catch {
    return sub_type === Binary.SUBTYPE_UUID
      // Case 2 : BinaryID (only subtype 4)
      ? new Binary(Buffer.from((_id as string).replaceAll('-', ''), 'hex'), sub_type)
      // Case 3 : Try as raw ID (e.g. number)
      : Number(_id)
  }
}
