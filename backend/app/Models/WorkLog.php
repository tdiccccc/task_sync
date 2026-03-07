<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'task_category_id',
        'task_id',
        'work_date',
        'work_minutes',
        'comment',
    ];

    protected function casts(): array
    {
        return [
            'work_date' => 'date',
            'work_minutes' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function taskCategory(): BelongsTo
    {
        return $this->belongsTo(TaskCategory::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
