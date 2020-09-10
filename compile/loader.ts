import { transform } from './transform'

export default (ipt: string) => {
    return transform(JSON.parse(ipt))
}
