<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * UpdateProjectRequest
 */
class UpdateProjectRequest extends FormRequest
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
            'amount' => ['required', 'numeric', 'min:0'],
            'description' => ['required', 'string', 'max:500'],
            'started_at' => ['nullable', 'date_format:Y-m-d\TH:i:s\Z,Y-m-d\TH:i:sP', 'regex://^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?(Z|[+-]\\d{2}:\\d{2})$//'],
            'ended_at' => ['nullable', 'date_format:Y-m-d\TH:i:s\Z,Y-m-d\TH:i:sP', 'regex://^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?(Z|[+-]\\d{2}:\\d{2})$//'],
            'is_active' => ['required', 'boolean'],
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
            'name.required' => '案件名は必須です',
            'name.string' => '案件名は文字列である必要があります',
            'name.max' => '案件名は50文字以内で入力してください',
            'name.min' => '案件名は1文字以上で入力してください',
            'amount.required' => '金額は必須です',
            'amount.numeric' => '金額は数値である必要があります',
            'amount.min' => '金額は0以上である必要があります',
            'description.required' => '案件の概要は必須です',
            'description.string' => '案件の概要は文字列である必要があります',
            'description.max' => '案件の概要は500文字以内で入力してください',
            'is_active.required' => '進行中フラグは必須です',
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
     * Get amount
     */
    public function getAmount(): float
    {
        return $this->input('amount');
    }

    /**
     * Get description
     */
    public function getDescription(): string
    {
        return $this->input('description');
    }

    /**
     * Get started_at
     */
    public function getStartedAt(): ?string
    {
        return $this->input('started_at');
    }

    /**
     * Get ended_at
     */
    public function getEndedAt(): ?string
    {
        return $this->input('ended_at');
    }

    /**
     * Get is_active
     */
    public function getIsActive(): bool
    {
        return $this->input('is_active');
    }

}
