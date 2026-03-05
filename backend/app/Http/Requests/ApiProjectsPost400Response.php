<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * ApiProjectsPost400Response
 */
class ApiProjectsPost400Response extends FormRequest
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
            'message' => ['required', 'string'],
            'errors' => ['required'],
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
            'message.required' => 'は必須です',
            'message.string' => 'は文字列である必要があります',
            'errors.required' => 'は必須です',
        ];
    }

    // --- Getters ---

    /**
     * Get message
     */
    public function getMessage(): string
    {
        return $this->input('message');
    }

    /**
     * Get errors
     */
    public function getErrors(): mixed
    {
        return $this->input('errors');
    }

}

