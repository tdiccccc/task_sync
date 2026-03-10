<?php

declare(strict_types=1);

namespace Domains\TaskCategory\Repositories;

use Domains\TaskCategory\Entities\TaskCategoryEntity;

/**
 * タスクカテゴリリポジトリインターフェース
 *
 * Domain層が定義するデータアクセスの契約。
 * 実装はInfrastructure層に委ねる。
 */
interface TaskCategoryRepositoryInterface
{
    /**
     * プロジェクトIDに紐づくカテゴリ一覧を取得
     *
     * @return TaskCategoryEntity[]
     */
    public function findByProjectId(int $projectId): array;

    /**
     * IDで1件取得
     */
    public function findById(int $id): ?TaskCategoryEntity;

    /**
     * 新規作成
     */
    public function create(
        int $projectId,
        string $name,
        ?string $description,
        ?string $color,
        int $sortOrder,
    ): TaskCategoryEntity;

    /**
     * 更新
     */
    public function update(
        int $id,
        string $name,
        ?string $description,
        ?string $color,
        int $sortOrder,
    ): TaskCategoryEntity;

    /**
     * 削除（物理削除）
     */
    public function delete(int $id): void;
}