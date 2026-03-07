<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'task_category_id',
        'name',
        'description',
        'status',
        'estimated_hours',
        'created_by',
        'assigned_to',
        'due_date',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'estimated_hours' => 'decimal:2',
            'due_date' => 'date',
            'archived_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function taskCategory(): BelongsTo
    {
        return $this->belongsTo(TaskCategory::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function workLogs(): HasMany
    {
        return $this->hasMany(WorkLog::class);
    }
}
