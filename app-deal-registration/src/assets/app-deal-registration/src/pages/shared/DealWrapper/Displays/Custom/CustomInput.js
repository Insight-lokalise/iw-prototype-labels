import { createField } from '../../utils'

export default function CustomInput({ input, ...context }) {
	const field = input(context)
	return createField(field, context)
}
