import validator from './validator'
import utilsPro from './utilsPro'

const install = {
  validator: {
    ...validator
  },
  utilsPro: {
    ...utilsPro
  }
}

export default {
  ...install
}
