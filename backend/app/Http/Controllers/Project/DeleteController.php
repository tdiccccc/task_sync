<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Application\Project\UseCases\DeleteProjectUseCase;
use Illuminate\Http\JsonResponse;

class DeleteController extends Controller
{
    public function __construct(
        private readonly DeleteProjectUseCase $useCase
    ) {}

    public function __invoke(int $id): JsonResponse
    {
        $this->useCase->execute($id);

        return response()->json([
            'message' => 'プロジェクトを削除しました',
        ]);
    }
}
