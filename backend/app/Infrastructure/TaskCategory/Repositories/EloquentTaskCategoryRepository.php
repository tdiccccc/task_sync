<?php

declare(strict_types=1);

namespace Infrastructure\TaskCategory\Repositories;

use App\Models\TaskCategory;
use Domains\TaskCategory\Entities\TaskCategoryEntity;
use Domains\TaskCategory\Repositories\TaskCategoryRepositoryInterface;

class EloquentTaskCategoryRepository implements TaskCategoryRepositoryInterface
{
    /**
     * {@inheritdoc}
     */
    public function findByProjectId(int $projectId): array
    {
        return TaskCategory::where('project_id', $projectId)
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get()
            ->map(fn (TaskCategory $model) => $this->toEntity($model))
            ->all();
    }

    /**
     * {@inheritdoc}
     */
    public function findById(int $id): ?TaskCategoryEntity
    {
        $model = TaskCategory::find($id);

        if ($model === null) {
            return null;
        }

        return $this->toEntity($model);
    }

    /**
     * {@inheritdoc}
     */
    public function create(
        int $projectId,
        string $name,
        ?string $description,
        ?string $color,
        int $sortOrder,
    ): TaskCategoryEntity {
        $model = TaskCategory::create([
            'project_id' => $projectId,
            'name' => $name,
            'description' => $description,
            'color' => $color,
            'sort_order' => $sortOrder,
        ]);

        return $this->toEntity($model);
    }

    /**
     * {@inheritdoc}
     */
    public function update(
        int $id,
        string $name,
        ?string $description,
        ?string $color,
        int $sortOrder,
    ): TaskCategoryEntity {
        $model = TaskCategory::findOrFail($id);

        $model->update([
            'name' => $name,
            'description' => $description,
            'color' => $color,
            'sort_order' => $sortOrder,
        ]);

        return $this->toEntity($model->fresh());
    }

    /**
     * {@inheritdoc}
     */
    public function delete(int $id): void
    {
        $model = TaskCategory::findOrFail($id);
        $model->delete(); // 物理削除（SoftDeletesなし）
    }

    /**
     * Eloquent Model → Domain Entity に変換
     */
    private function toEntity(TaskCategory $model): TaskCategoryEntity
    {
        return new TaskCategoryEntity(
            id: $model->id,
            projectId: $model->project_id,
            name: $model->name,
            description: $model->description,
            color: $model->color,
            sortOrder: $model->sort_order,
            createdAt: $model->created_at->toISOString(),
            updatedAt: $model->updated_at->toISOString(),
        );
    }
}