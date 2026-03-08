<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProjectRequest;
use Application\Project\UseCases\CreateProjectUseCase;
use Illuminate\Http\JsonResponse;

class CreateController extends Controller
{
    public function __construct(
        private readonly CreateProjectUseCase $useCase
    ) {}

    public function __invoke(CreateProjectRequest $request): JsonResponse
    {
        $entity = $this->useCase->execute(
            name: $request->getName(),
            amount: $request->getAmount(),
            description: $request->getDescription(),
            startedAt: $request->getStartedAt(),
            endedAt: $request->getEndedAt(),
            isActive: $request->getIsActive() ?? true,
        );

        return response()->json([
            'id' => $entity->id,
            'name' => $entity->name,
            'amount' => $entity->amount,
            'description' => $entity->description,
            'started_at' => $entity->startedAt,
            'ended_at' => $entity->endedAt,
            'is_active' => $entity->isActive,
            'created_at' => $entity->createdAt,
            'updated_at' => $entity->updatedAt,
        ], 201);
    }
}