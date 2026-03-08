<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Repositories\ProjectRepositoryInterface;

class GetProjectListUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    /**
     * @return array{data: \Domains\Project\Entities\ProjectEntity[], meta: array{current_page: int, last_page: int, per_page: int, total: int}}
     */
    public function execute(int $perPage = 15, ?bool $isActive = null): array
    {
        return $this->repository->paginate($perPage, $isActive);
    }
}