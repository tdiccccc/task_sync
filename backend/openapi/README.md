# OpenAPI Generator - FormRequest自動生成

OpenAPI仕様からLaravel FormRequestを自動生成する仕組みです。

## セットアップ完了内容

✅ **設定ファイル**:
- `config.json`: 生成設定（名前空間、出力先）
- `templates/model_generic.mustache`: Laravel FormRequest用テンプレート
- `generate-requests.sh`: 生成スクリプト（Docker版）
- `../app/Http/Requests/.openapi-generator-ignore`: 生成除外設定

✅ **devcontainer設定**:
- `.devcontainer/devcontainer.json`: Docker socket マウント設定済み
- `.devcontainer/post-create.sh`: Docker CLI 自動インストール設定済み

## 使用方法

### 1. devcontainerを再起動（初回のみ必要）

Docker socket のマウント設定を反映するため、devcontainerを再起動してください:

**VS Codeの場合**:
1. コマンドパレット (Cmd/Ctrl+Shift+P)
2. "Dev Containers: Rebuild Container" を選択

### 2. FormRequestを生成

```bash
cd /workspace/backend
bash openapi/generate-requests.sh
```

または

```bash
composer generate:requests
```

## 生成される内容

`openapi.yaml` の `components/schemas` に定義されたスキーマから、
`app/Http/Requests/` 配下にLaravel FormRequestが自動生成されます。

### 例: CreateProjectRequest

```yaml
components:
  schemas:
    CreateProjectRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 50
```

↓ 自動生成

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => '案件名は必須です',
            'name.max' => '案件名は50文字以内で入力してください',
        ];
    }
}
```

## トラブルシューティング

### Docker daemon に接続できない

```
docker: Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**解決方法**: devcontainerを再起動してください。Docker socketのマウント設定が反映されます。

### Dockerコマンドが見つからない

```
docker: command not found
```

**解決方法**: post-create.shでDocker CLIが自動インストールされます。devcontainerを再起動してください。

## 技術詳細

- **ツール**: OpenAPI Generator CLI v7.4.0
- **生成器**: php (Laravel FormRequest用にカスタマイズ)
- **実行方法**: Docker経由（Java不要）
- **出力先**: `app/Http/Requests/`
- **名前空間**: `App\Http\Requests`

## 設計思想

- **Presentation層（FormRequest）**: OpenAPI仕様から自動生成
- **Domain/Application/Infrastructure層**: 手動実装で学習

これにより、バリデーションは自動化しつつ、ビジネスロジックの実装に集中できます。
