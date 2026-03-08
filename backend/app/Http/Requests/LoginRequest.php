<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * LoginRequest
 */
class LoginRequest extends FormRequest
{
    /**
     * このリクエストの認可ロジック
     */
    public function authorize(): bool
    {
        // 必要に応じて認可ロジックを実装
        return true;
    }

    /**
     * バリデーションルール
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string'],
            'password' => ['required', 'string', 'min:1'],
        ];
    }

    /**
     * バリデーションエラーメッセージのカスタマイズ
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'メールアドレスは必須です',
            'email.string' => 'メールアドレスは文字列である必要があります',
            'password.required' => 'パスワードは必須です',
            'password.string' => 'パスワードは文字列である必要があります',
            'password.min' => 'パスワードは1文字以上で入力してください',
        ];
    }

    // --- Getters ---

    /**
     * Get email
     */
    public function getEmail(): string
    {
        return $this->input('email');
    }

    /**
     * Get password
     */
    public function getPassword(): string
    {
        return $this->input('password');
    }

}
