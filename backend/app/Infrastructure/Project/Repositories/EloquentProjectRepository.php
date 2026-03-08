<?php

declare(strict_types=1);

namespace Infrastructure\Project\Repositories;

use App\Models\Project;
use Domains\Project\Entities\ProjectEntity;
use Domains\Project\Repositories\ProjectRepositoryInterface;

class EloquentProjectRepository implements ProjectRepositoryInterface
{
    /**
     * {@inheritdoc}
     */
    public function paginate(int $perPage = 15, ?bool $isActive = null): array
    {
        $query = Project::query();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return [
            'data' => collect($paginator->items())->map(
                fn (Project $model) => $this->toEntity($model)
            )->all(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function findById(int $id): ?ProjectEntity
    {
        $model = Project::find($id);

        if ($model === null) {
            return null;
        }

        return $this->toEntity($model);
    }

    /**
     * {@inheritdoc}
     */
    public function create(
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity {
        $model = Project::create([
            'name' => $name,
            'amount' => $amount,
            'description' => $description,
            'started_at' => $startedAt,
            'ended_at' => $endedAt,
            'is_active' => $isActive,
        ]);

        return $this->toEntity($model);
    }

    /**
     * {@inheritdoc}
     */
    public function update(
        int $id,
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity {
        $model = Project::findOrFail($id);

        $model->update([
            'name' => $name,
            'amount' => $amount,
            'description' => $description,
            'started_at' => $startedAt,
            'ended_at' => $endedAt,
            'is_active' => $isActive,
        ]);

        return $this->toEntity($model->fresh());
    }

    /**
     * {@inheritdoc}
     */
    public function delete(int $id): void
    {
        $model = Project::findOrFail($id);
        $model->delete(); // SoftDeletesにより論理削除
    }

    /**
     * Eloquent Model → Domain Entity に変換
     */
    private function toEntity(Project $model): ProjectEntity
    {
        return new ProjectEntity(
            id: $model->id,
            name: $model->name,
            amount: (float) $model->amount,
            description: $model->description,
            startedAt: $model->started_at?->toISOString(),
            endedAt: $model->ended_at?->toISOString(),
            isActive: $model->is_active,
            createdAt: $model->created_at->toISOString(),
            updatedAt: $model->updated_at->toISOString(),
        );
    }
}