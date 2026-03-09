<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * UpdateTaskCategoryRequest
 */
class UpdateTaskCategoryRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', 'min:1'],
            'description' => ['nullable', 'string', 'max:500'],
            'color' => ['nullable', 'string', 'regex://^#[0-9A-Fa-f]{6}$//'],
            'sort_order' => ['required', 'integer', 'numeric', 'min:0'],
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
            'name.required' => 'カテゴリ名は必須です',
            'name.string' => 'カテゴリ名は文字列である必要があります',
            'name.max' => 'カテゴリ名は50文字以内で入力してください',
            'name.min' => 'カテゴリ名は1文字以上で入力してください',
            'description.string' => '説明は文字列である必要があります',
            'description.max' => '説明は500文字以内で入力してください',
            'color.string' => 'カラーコードは文字列である必要があります',
            'sort_order.required' => '表示順は必須です',
            'sort_order.integer' => '表示順は整数である必要があります',
            'sort_order.numeric' => '表示順は数値である必要があります',
            'sort_order.min' => '表示順は0以上である必要があります',
        ];
    }

    // --- Getters ---

    /**
     * Get name
     */
    public function getName(): string
    {
        return $this->input('name');
    }

    /**
     * Get description
     */
    public function getDescription(): ?string
    {
        return $this->input('description');
    }

    /**
     * Get color
     */
    public function getColor(): ?string
    {
        return $this->input('color');
    }

    /**
     * Get sort_order
     */
    public function getSortOrder(): intfloat
    {
        return $this->input('sort_order');
    }

}

