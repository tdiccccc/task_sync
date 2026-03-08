<?php

declare(strict_types=1);

namespace Domains\Project\Repositories;

use Domains\Project\Entities\ProjectEntity;

/**
 * プロジェクトリポジトリインターフェース
 *
 * Domain層が定義するデータアクセスの契約。
 * 実装はInfrastructure層に委ねる。
 */
interface ProjectRepositoryInterface
{
    /**
     * ページネーション付きで一覧を取得
     *
     * @return array{data: ProjectEntity[], meta: array{current_page: int, last_page: int, per_page: int, total: int}}
     */
    public function paginate(int $perPage = 15, ?bool $isActive = null): array;

    /**
     * IDで1件取得
     */
    public function findById(int $id): ?ProjectEntity;

    /**
     * 新規作成
     */
    public function create(
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity;

    /**
     * 更新
     */
    public function update(
        int $id,
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity;

    /**
     * 削除（ソフトデリート）
     */
    public function delete(int $id): void;
}