<?php

namespace App\Shared\Traits;

use App\Modules\Audit\Models\AuditLog;

/**
 * Modelning create/update/delete/restore hodisalarini audit_logs jadvaliga yozadi.
 * Ishlatish uchun modelga `use Auditable;` qo'shish kifoya.
 */
trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(fn ($model) => $model->writeAuditLog(AuditLog::ACTION_CREATED));

        static::updated(function ($model) {
            $changes = $model->getChanges();
            unset($changes['updated_at']);

            if (! empty($changes)) {
                $model->writeAuditLog(AuditLog::ACTION_UPDATED, $model->maskSensitiveAuditFields($changes));
            }
        });

        static::deleted(fn ($model) => $model->writeAuditLog(AuditLog::ACTION_DELETED));

        if (method_exists(static::class, 'restored')) {
            static::restored(fn ($model) => $model->writeAuditLog(AuditLog::ACTION_RESTORED));
        }
    }

    protected function writeAuditLog(string $action, ?array $changes = null): void
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'auditable_type' => static::class,
            'auditable_id' => $this->getKey(),
            'auditable_label' => $this->auditLabel(),
            'changes' => $changes,
            'ip_address' => request()?->ip(),
        ]);
    }

    protected function auditLabel(): ?string
    {
        return $this->name ?? $this->title ?? $this->key ?? (string) $this->getKey();
    }

    protected function maskSensitiveAuditFields(array $changes): array
    {
        foreach (['password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes'] as $field) {
            if (array_key_exists($field, $changes)) {
                $changes[$field] = '••••••••';
            }
        }

        return $changes;
    }
}
