// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-plugin-prettier/recommended'

export default withNuxt(
  // Prettier統合設定
  prettier,
  // カスタム設定
  {
    rules: {
      'prettier/prettier': 'error',
    },
  }
)
