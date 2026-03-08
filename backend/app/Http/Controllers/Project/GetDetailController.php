<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Application\Project\UseCases\GetProjectDetailUseCase;
use Illuminate\Http\JsonResponse;

class GetDetailController extends Controller
{
    public function __construct(
        private readonly GetProjectDetailUseCase $useCase
    ) {}

    public function __invoke(int $id): JsonResponse
    {
        $entity = $this->useCase->execute($id);

        if ($entity === null) {
            return response()->json(['message' => 'プロジェクトが見つかりません'], 404);
        }

        return response()->json([
            'data' => [
                'id' => $entity->id,
                'name' => $entity->name,
                'amount' => $entity->amount,
                'description' => $entity->description,
                'started_at' => $entity->startedAt,
                'ended_at' => $entity->endedAt,
                'is_active' => $entity->isActive,
                'created_at' => $entity->createdAt,
                'updated_at' => $entity->updatedAt,
            ],
        ]);
    }
}