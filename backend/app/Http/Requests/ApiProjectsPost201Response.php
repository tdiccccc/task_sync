<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * ApiProjectsPost201Response
 */
class ApiProjectsPost201Response extends FormRequest
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
            'id' => ['required', 'numeric'],
            'name' => ['required', 'string'],
            'amount' => ['required', 'numeric'],
            'description' => ['required', 'string'],
            'started_at' => ['required', 'string'],
            'ended_at' => ['required', 'string'],
            'is_active' => ['required', 'boolean'],
            'created_at' => ['required', 'string'],
            'updated_at' => ['required', 'string'],
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
            'id.required' => 'は必須です',
            'id.numeric' => 'は数値である必要があります',
            'name.required' => 'は必須です',
            'name.string' => 'は文字列である必要があります',
            'amount.required' => 'は必須です',
            'amount.numeric' => 'は数値である必要があります',
            'description.required' => 'は必須です',
            'description.string' => 'は文字列である必要があります',
            'started_at.required' => 'は必須です',
            'started_at.string' => 'は文字列である必要があります',
            'ended_at.required' => 'は必須です',
            'ended_at.string' => 'は文字列である必要があります',
            'is_active.required' => 'は必須です',
            'created_at.required' => 'は必須です',
            'created_at.string' => 'は文字列である必要があります',
            'updated_at.required' => 'は必須です',
            'updated_at.string' => 'は文字列である必要があります',
        ];
    }

    // --- Getters ---

    /**
     * Get id
     */
    public function getId(): float
    {
        return $this->input('id');
    }

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
    public function getStartedAt(): string
    {
        return $this->input('started_at');
    }

    /**
     * Get ended_at
     */
    public function getEndedAt(): string
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

    /**
     * Get created_at
     */
    public function getCreatedAt(): string
    {
        return $this->input('created_at');
    }

    /**
     * Get updated_at
     */
    public function getUpdatedAt(): string
    {
        return $this->input('updated_at');
    }

}

