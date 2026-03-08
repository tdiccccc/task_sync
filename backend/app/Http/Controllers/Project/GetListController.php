<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Application\Project\UseCases\GetProjectListUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetListController extends Controller
{
    public function __construct(
        private readonly GetProjectListUseCase $useCase
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $isActive = $request->query('is_active');

        // クエリパラメータの型変換（"true"/"false" → bool）
        $isActiveBool = null;
        if ($isActive !== null) {
            $isActiveBool = filter_var($isActive, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        }

        $result = $this->useCase->execute($perPage, $isActiveBool);

        return response()->json([
            'data' => collect($result['data'])->map(fn ($entity) => $this->toArray($entity)),
            'meta' => $result['meta'],
        ]);
    }

    private function toArray(object $entity): array
    {
        return [
            'id' => $entity->id,
            'name' => $entity->name,
            'amount' => $entity->amount,
            'description' => $entity->description,
            'started_at' => $entity->startedAt,
            'ended_at' => $entity->endedAt,
            'is_active' => $entity->isActive,
            'created_at' => $entity->createdAt,
            'updated_at' => $entity->updatedAt,
        ];
    }
}